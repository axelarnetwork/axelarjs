// const request = async (params) => {
//   const response = await fetch(process.env.NEXT_PUBLIC_GMP_API_URL, {
//     method: "POST",
//     body: JSON.stringify(params),
//   }).catch(() => {
//     return null;
//   });

//   return response && (await response.json());
// };

export const getContracts = async (params = {}) =>
  // await request({
  //   ...params,
  //   method: "getContracts",
  // });
  new Promise((resolve) => {
    resolve([]);
  });
