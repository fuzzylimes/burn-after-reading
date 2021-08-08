<script>
import { onMount } from "svelte";
import NotFound from "../components/BadLink.svelte"

export let params = {};

let value = '';
let exists = '';

const burn = async () => {
	try {
		const res = await fetch(`/api/burn?noteId=${params.id}`)
		if (res.status !== 200) {
			console.error(res.status);
			exists = false;
		} else {
			const data = await res.json();
			value = data.data;
		}
	} catch(err) {
		console.error(err);
		exists = false;
	};
}

const copy = () => {
	let temp = document.createElement('textarea');
	temp.value = value;
	document.body.appendChild(temp);
	temp.select();
	document.execCommand('copy');
	document.body.removeChild(temp);
	alert('Copied to clipboard');
}

onMount(async () => {
	try {
		const res = await fetch(`/api/get?noteId=${params.id}`)
		if (res.status == 200) {
			exists = true;
		} else {
			console.error(`${res.status}`);
			exists = false;
		}
	} catch(err) {
		console.error(err);
		exists = false;
	};
});
	
</script>

<main>
	<div class="hero is-fullheight-with-navbar is-dark">
		<div class="hero-body">
			<div class="container">
				<div class="columns has-text-centered is-centered">
					<div class="column is-9-tablet is-half-widescreen">
						<img src="./bar-logo.svg" alt="logo">
						<div class="section">
							{#if exists === false}
							<NotFound />
							{:else if exists === true}
							<div class="box">
								{#if !value}
								<p class="title is-2 has-text-black">
									You've been sent a secure message.
								</p>
								<p class="is-size-5">
									<span class="has-text-weight-medium">Burn After Reading</span> provides a secure way of sharing sensitive information, such as passwords, through a single use link. Once you click the button below, you will not be able to return to this page. Be sure to copy/save any of the shared information.
								</p>
								<button class="button is-danger mt-3" on:click={burn}><i class="fas fa-fire"></i><span class="mx-3">Open</span><i class="fas fa-fire"></i></button>
								{:else}
								<p class="is-size-5">
									This is the only time you will see this message. Be sure to copy/save all shared information. You cannot return to this page.
								</p>
								<div class="field has-addons pt-3">
									<div class="control is-expanded">
										<textarea class="textarea" type="text" bind:value/>
									</div>
									<div class="control">
										<button class="button is-info" on:click={copy} style="height: 100%;"><i class="fas fa-copy"></i></button>
									</div>
								</div>
								{/if}
							</div>
							{/if}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</main>

<style>
</style>