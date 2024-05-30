import {
	OpenAPIRoute,
	OpenAPIRouteSchema,
	Query,
} from "@cloudflare/itty-router-openapi";
import { Chain } from "../types";

export class ChainList extends OpenAPIRoute {
	static schema: OpenAPIRouteSchema = {
		tags: ["Chains"],
		summary: "List Chains",
		parameters: {
			page: Query(Number, {
				description: "Page number",
				default: 0,
			}),
			isCompleted: Query(Boolean, {
				description: "Filter by completed flag",
				required: false,
			}),
		},
		responses: {
			"200": {
				description: "Returns a list of chains and their gas prices",
				schema: {
					success: Boolean,
					result: {
						chains: [Chain],
					},
				},
			},
		},
	};

	async handle(
		request: Request,
		env: any,
		context: any,
		data: Record<string, any>
	) {
		// Retrieve the validated parameters
		const { page, isCompleted } = data.query;

		// Implement your own object list here

		return {
			success: true,
			chains: [
				{
					name: "Avalanche",
					slug: "avalanche",
					description: null,
					gasPriceGwei: 28,
					updated: "2024-05-29",
				}
			],
		};
	}
}
