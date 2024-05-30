import { OpenAPIRouter } from "@cloudflare/itty-router-openapi";
import { TaskFetch } from "./endpoints/taskFetch";
import { ChainList } from "./endpoints/chainList";

export const router = OpenAPIRouter({
	docs_url: "/",
});

router.get("/api/gasPrices/", ChainList);
router.get("/api/gasPrices/:chainSlug/", TaskFetch);

// 404 for everything else
router.all("*", () =>
	Response.json(
		{
			success: false,
			error: "Route not found",
		},
		{ status: 404 }
	)
);

export default {
	fetch: router.handle,
};
