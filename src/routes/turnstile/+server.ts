const html = `
<head>
	<link
		rel="preload"
		href="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
		as="script" />
	<script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"></script>
</head>

<body style="width: fit-content; height: fit-content; margin: 0px;">
    <div id="turnstile-container"></div>
</body>
<script>
    turnstile.ready(function () {
        let container = document.getElementById("turnstile-container");

        if (container) {
            container.innerHTML = "";
        }
        // @ts-ignore
        widgetId = turnstile.render("#turnstile-container", {
            sitekey: "0x4AAAAAABiGbbOhSUc5vWl9",
            callback: function (token) {
                if (window.webkit) {
                    window.webkit?.messageHandlers.turnstile.postMessage(token);
                }
            }
        });
    });
</script>

`;

export function GET() {
	return new Response(html, {
		headers: {
			"Content-Type": "text/html"
		}
	});
}
