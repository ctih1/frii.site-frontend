export interface TLD {
	tld: string;
	purchaseLink?: string;
	hidden: boolean;
}
export const AVAILABLE_TLDS: TLD[] = [
	{
		tld: ".frii.site",
		hidden: false
	},
	{
		tld: ".arr.ovh",
		purchaseLink: "https://ko-fi.com/s/ee4b5170a6",
		hidden: false
	},
	{
		tld: ".pill.ovh",
		purchaseLink: "https://ko-fi.com/s/38e30ddc66",
		hidden: false
	},
	{
		tld: ".suomi.dev",
		hidden: true
	}
];
