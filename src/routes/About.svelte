<script>
import Footer from "../components/Footer.svelte";
</script>

<main id="wrapper">
    <div class="section">
        <div class="columns is-centered">
            <div class="column is-8-tablet is-6-widescreen">
                <div class="container">
                    <h1 class="title is-1">About</h1>
                    <p class="my-3">Burn After Reading allows you to share one time messages with others that are destroyed on delivery. It can be used to send secure information, such as passwords or other details, via a link. Upon opening the link, the information will be deleted.</p>
                    <p>This was created as a fun side project. I make no money off of it, and I do not care about your data. All information you enter into the site will be deleted when the recipient opens the link or 24 hours have passed since generating the link. All data is encrypted before storage.</p>
                </div>
                <div class="container mt-5">
                    <h3 class="title is-3">Credits</h3>
                    <ul>
                        <li>Icons provided, unmodified, by <a href="https://fontawesome.com">Font Awesome</a> under <a href="https://fontawesome.com/license">their licese.</a> </li>
                        <li>Favicon made by <a href="https://www.flaticon.com/authors/vectors-market" title="Vectors Market">Vectors Market</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</main>
<Footer />

<style>        
    #wrapper {
        flex: 1;
    }
</style>