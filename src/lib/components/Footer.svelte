<script lang="ts">
    import { t } from "$lib/translations";
    import { serverURL } from "../../serverContactor";
    
    const commit = __BUILD_COMMIT__;
    const time = __BUILD_TIME__;

</script>   

<div class="footer">
    <div class="contact">
        <h3>{$t("footer_contact")}</h3>
        <a href="mailto: support@frii.site">{$t("footer_contact_support")}</a>
        <a href="mailto: urgent@frii.site">{$t("footer_contact_urgent")}</a>
        <a href="mailto: support@frii.site">{$t("footer_contact_social")}</a>
        <a href="https://discord.gg/FjujyhvbMY">{$t("footer_contact_discord")}</a>
    </div>
    <div class="starting">
        <h3>{$t("footer_started")}</h3>
        <a href="https://github.com/ctih1/frii.site-frontend/wiki/FAQ">{$t("footer_started_faq")}</a>
        <a href="https://github.com/ctih1/frii.site-frontend/wiki/Getting-Started#getting-started">{$t("footer_started_register")}</a>
        <a href="https://github.com/ctih1/frii.site-frontend/wiki/Getting-Started#managing-your-domains">{$t("footer_started_modify")}</a>
        <a href="https://github.com/ctih1/frii.site-frontend/wiki/Getting-Started#account-management">{$t("footer_started_account")}</a>
        <a href="https://github.com/ctih1/frii.site-frontend/wiki/API">{$t("footer_started_api")}</a>
    </div>
    <div class="dev">
        <h3>{$t("footer_dev")}</h3>
        <a href="https://github.com/ctih1/frii.site-frontend/wiki/Translation-guide">{$t("footer_dev_translations")}</a>
        <a href="https://github.com/ctih1/frii.site-frontend/blob/master/.github/CONTRIBUTING.md">{$t("footer_dev_coding")}</a>
        <a href="https://github.com/ctih1/frii.site-frontend/discussions/67">{$t("footer_dev_partner")}</a>
        <p style="margin: 0px;">Using server {serverURL}</p>
        <p style="margin: 0px;">Commit {commit}</p>
        <p style="margin: 0px;">Built {time}</p>
    </div>
</div>

<style>
    .footer {
        display: grid;
        grid-template-columns: repeat(3,1fr);
        grid-template-rows: repeat(auto,1fr);
        max-width: 100vw;
        width: 100%;
        padding-bottom: 2em;
        text-align: center;
        background-color: var(--offwhite-color);
    }
    .footer * {
        display: flex;
        flex-direction: column;
    }
    a {
        color: white;
        text-decoration: underline;
        width: fit-content;
        margin-right: auto;
        margin-left: auto;
    }

    @media(orientation:portrait) {
        .footer {
            display: flex;
            flex-direction: column;
        }
    }
</style>
