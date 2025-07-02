export async function load({ cookies }) {
	return {
		domainAmount: Number(cookies.get("domain-amount")) ?? 3
	};
}
