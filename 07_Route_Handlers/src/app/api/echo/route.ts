//
export async function GET(request: Request, response: Response) {
  // console.log("-------------------------------------- 1");
  // console.log("request = ", request);

  console.log("----------------------------------------- 2");
  console.log("new URL(request.url) = ", new URL(request.url));

  console.log("---------------------------------------- 3");
  console.log(
    "new URLSearchParams(request.url) = ",
    new URLSearchParams(request.url),
  );
  console.log("---------------------------------------- 4");

  /*---------one way of getting params -------------*/

  const { searchParams } = new URL(request.url);
  console.log("searchParams = ", searchParams);

  const name = searchParams.get("name");
  console.log("name = ", name);

  const country = searchParams.get("country");
  console.log("country = ", country);

  console.log("----------------------------------------");
  /*--------  another efficient way of getting params ------*/

  console.log("searchParams.entries() = ", searchParams.entries());

  const obj = Object.fromEntries(searchParams.entries());
  console.log("obj = ", obj);

  return Response.json(obj);
}
