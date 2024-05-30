import {
	OpenAPIRoute,
	OpenAPIRouteSchema,
	Path,
} from "@cloudflare/itty-router-openapi";
import { Chain } from "../types";

export class TaskFetch extends OpenAPIRoute {
	static schema: OpenAPIRouteSchema = {
		tags: ["Chains"],
		summary: "Get gas configs for a single Chain by slug",
		parameters: {
			chainSlug: Path(String, {
				description: "Chain slug",
			}),
		},
		responses: {
			"200": {
				description: "Returns a single chain if found",
				schema: {
					success: Boolean,
					result: {
						chain: Chain,
					},
				},
			},
			"404": {
				description: "Chain not found",
				schema: {
					success: Boolean,
					error: String,
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
		// Retrieve the validated slug
		const { taskSlug } = data.params;

		// Implement your own object fetch here

		const exists = true;

		// @ts-ignore: check if the object exists
		if (exists === false) {
			return Response.json(
				{
					success: false,
					error: "Object not found",
				},
				{
					status: 404,
				}
			);
		}

		return {
			success: true,
			task: {
				name: "my task",
				slug: taskSlug,
				description: "this needs to be done",
				completed: false,
				due_date: new Date().toISOString().slice(0, 10),
			},
		};
	}
}
