<script>
	const host = window.location.host;
	let value = '';
	let characters;
	let url;
	const max = 1000;

	$: value, getCharacters();

	const getCharacters = () => {
		characters = `${value.length}/${max}`
	}

	const submit = async () => {
		try {
			const res = await fetch('/api/put', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					message: value
				}),
			});
			if (res.status !== 200) {
				console.error(res.status);
			} else {
				const data = await res.json();
				url = `${host}/#/burn/${data.id}`;
			}
		} catch(err) {
			console.error(err);
		};
	}

	const startOver = () => {
		url = '';
	}

	const copy = () => {
		let temp = document.createElement('textarea');
		temp.value = url;
		document.body.appendChild(temp);
		temp.select();
		document.execCommand('copy');
		document.body.removeChild(temp);
		alert('Copied to clipboard');
	}
	
</script>

<main>
	<div class="hero is-fullheight-with-navbar is-dark">
		<div class="hero-body">
			<div class="container">
				<div class="columns has-text-centered is-centered">
					<div class="column is-9-tablet is-half-widescreen">
						<p class="title is-2">
							Send secure messages through a one-time link!
						</p>
						<p class="is-size-5">
							<span class="has-text-weight-medium">Burn After Reading</span> lets you share information securely via single use links. Simply enter the information you'd like to share and click <span class="is-bold is-italic">Generate</span> to get your one-time link!
						</p>
						<div class="section">
							<div class="box">
								{#if !url}
								<textarea bind:value id="data" cols="30" rows="5" maxlength={max} class="textarea"></textarea>
								<p class="has-text-right">
									<span class="tag is-success is-light">{characters}</span>
								</p>
								{:else}
								<div class="field has-addons">
									<div class="control is-expanded">
										<input class="input" type="text" bind:value="{url}">
									</div>
									<div class="control">
										<button class="button is-info" on:click={copy}><i class="fas fa-copy"></i></button>
									</div>
								</div>
								{/if}
							</div>
							{#if !url}
							<button class="button is-light mt-3" on:click={submit}>Generate</button>
							{:else}
							<button class="button is-light mt-3" on:click={startOver}>Start Over</button>
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