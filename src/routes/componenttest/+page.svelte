<script lang="ts">
	import BlogCard from "$lib/components/BlogCard.svelte";
	import Button from "$lib/components/Button.svelte";
	import Collapse from "$lib/components/Collapse.svelte";
	import Dropdown from "$lib/components/Dropdown.svelte";
	import Holder from "$lib/components/Holder.svelte";
	import InputCompletor from "$lib/components/InputCompletor.svelte";
	import Loader from "$lib/components/Loader.svelte";
	import Modal from "$lib/components/Modal.svelte";
	import Placeholder from "$lib/components/Placeholder.svelte";
	import Pool from "$lib/components/Pool.svelte";
	import Registrar from "$lib/components/Registrar.svelte";
	import Review from "$lib/components/Review.svelte";
	import Scale from "$lib/components/Scale.svelte";
	import Section from "$lib/components/Section.svelte";
	import Spinner from "$lib/components/Spinner.svelte";
	import Switch from "$lib/components/Switch.svelte";
	import Tooltip from "$lib/components/Tooltip.svelte";
	import { m } from "../../paraglide/messages";

	let modal: Modal;
	let loader: Loader;
</script>

<Modal bind:this={modal} options={[m.modal_ok()]} description={""} title={""}></Modal>
<Loader bind:this={loader}></Loader>

<Holder>
	<Button
		on:click={_ =>
			modal.open(
				"test",
				"test description big text for a lot of big text that will always be visible no matter what"
			)}
		args={"padding fill"}>Show Modal</Button>
	<Button
		on:click={_ =>
			loader.show("Here is a loader text", "we are showing you an example of a loder")}
		args={"padding fill danger"}>Show Header</Button>

	<h1>Here's a h1</h1>
	<h2>Here's a h2</h2>
	<h3>Here's a h3</h3>
	<a href="#">This is a link</a>
	<p>This is a paragraph</p>
	<p><Placeholder /></p>

	<input placeholder="Heres an input component" />

	<Dropdown
		options={["This", "Is", "a ", "potential", "value"]}
		defaultValue="This"
		disabled={false}></Dropdown>

	<Switch initial={false} />
	<Tooltip>Heres some text</Tooltip>
	<InputCompletor
		inputPlaceholder="Predictive typing"
		removeUsed={true}
		suggestions={[
			{ displayText: "Hello", valueText: "hello" },
			{ displayText: "Test", valueText: "test" },
			{ displayText: "Are", valueText: "are" },
			{ displayText: "Some", valueText: "some" },
			{ displayText: "Text", valueText: "text" }
		]} />
	<Collapse title="Heres a collapse"><p>Heres a paragraph inside the collapsqe</p></Collapse>
	<BlogCard
		title="Hello heres a blog"
		description="# Here is the blog description"
		date={Math.floor(Date.now() / 1000)}
		url="/blogs/hello" />

	<Section id="part" title="Heres a section">
		<Review
			descrption="Heres a review description"
			author="Mystery developer "
			stars={4}
			index={1} />
	</Section>

	<Pool
		items={[
			{ displayText: "Hello", valueText: "hello" },
			{ displayText: "Test", valueText: "test" },
			{ displayText: "Are", valueText: "are" },
			{ displayText: "Some", valueText: "some" },
			{ displayText: "Text", valueText: "text" }
		]} />

	<Registrar />
	<Scale value={3} max={5} />
	<Spinner />
</Holder>
