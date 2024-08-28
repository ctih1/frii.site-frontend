import { serverURL } from "../../../serverContactor";
import { error } from "@sveltejs/kit";

export async function load({ params }) {
  interface article {
    date: number;
    title: string;
    body: string;
  }
  let articleName = params.slug;
  const dataRequest = await fetch(`${serverURL}/blog/${articleName}`, {
    method: "GET",
  });
  let data: article;
  try {
    data = (await dataRequest.json()) as article;
  } catch (SyntaxError) {
    error(404);
  }
  return data;
}

export async function _test_load({ params }) {
  interface article {
    date: number;
    title: string;
    body: string;
  }

  let data: article = {
    date: 1724859228,
    title: "how to get money $$$",
    body: "## just dont spend money",
  };

  return data;
}
