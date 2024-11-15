<script lang="ts">
  import Holder from "$lib/components/Holder.svelte"
  import Button from "$lib/components/Button.svelte"
  import { page } from "$app/stores";
  import { t } from "$lib/translations";

  const reason:string = $page.url.searchParams.get("reason")??"";
  let warningText:string = ""
  switch(reason) {
    case "permission":
    case "feature":
      warningText = $t("common.account_permissions_lack");
      break;
  }

</script>

<Holder>
    <h1>{$t("common.account_uhoh_annoyance")}</h1>
    <p>{warningText}</p>
</Holder>
