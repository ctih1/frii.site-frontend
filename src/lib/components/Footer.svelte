<script lang="ts">
    import { t } from "$lib/translations";
</script>

<div class="footer">
    <div class="contact">
        <h3>{$t("common.footer_contact")}</h3>
        <a href="mailto: support@frii.site">{$t("common.footer_contact_support")}</a>
        <a href="mailto: urgent@frii.site">{$t("common.footer_contact_urgent")}</a>
        <a href="mailto: support@frii.site">{$t("common.footer_contact_social")}</a>
        <a href="https://discord.gg/FjujyhvbMY">{$t("common.footer_contact_discord")}</a>
        <a href="mailto: whatdoyouwant@whatdidyouexpect.xyz">Fork Maintainer: whatdoyouwant@whatdidyouexpect.xyz</a>
    </div>
    <div class="starting">
        <h3>{$t("common.footer_started")}</h3>
        <a href="https://github.com/ctih1/frii.site-frontend/wiki/FAQ">{$t("common.footer_started_faq")}</a>
        <a href="https://github.com/ctih1/frii.site-frontend/wiki/Getting-Started#getting-started">{$t("common.footer_started_register")}</a>
        <a href="https://github.com/ctih1/frii.site-frontend/wiki/Getting-Started#managing-your-domains">{$t("common.footer_started_modify")}</a>
        <a href="https://github.com/ctih1/frii.site-frontend/wiki/Getting-Started#account-management">{$t("common.footer_started_account")}</a>
        <a href="https://github.com/ctih1/frii.site-frontend/wiki/API">{$t("common.footer_started_api")}</a>

    </div>
    <div class="dev">
        <h3>{$t("common.footer_dev")}</h3>
        <a href="https://github.com/ctih1/frii.site-frontend/wiki/Translation-guide">{$t("common.footer_dev_translations")}</a>
        <a href="https://github.com/ctih1/frii.site-frontend/blob/master/.github/CONTRIBUTING.md">{$t("common.footer_dev_coding")}</a>
        <a href="https://github.com/ctih1/frii.site-frontend/discussions/67">{$t("common.footer_dev_partner")}</a>
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
        background-color: rgb(39,39,39);
        color: white;
        border-radius: 10px;
    }
    .footer * {
        display: flex;
        flex-direction: column;
    }
    a {
        color: rgb(255, 255, 255);
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
