import getWikiResults from "@/libs/getWikiResults";
import { copyFileSync } from "fs";
import Items from "./components/Items";

type Props = {
  params: {
    searchTerm: string;
  };
};

//----------------------------------------------

export async function generateMetadata({ params }: Props) {
  const wikiData: Promise<SearchResult> = getWikiResults(params.searchTerm);
  const data = await wikiData;
  const displayTerm = params.searchTerm.replaceAll("%20", " ");

  if (!data?.query?.pages) {
    return {
      title: `${displayTerm} Not Found`,
    };
  }

  return {
    title: displayTerm,
    description: `Search results for ${displayTerm}`,
  };
}

//-----------------------------------------------

export default async function WikiResults({ params }: Props) {
  // const data = await getWikiResults(params.searchTerm); // data type is: any !

  const wikiData: Promise<SearchResult> = getWikiResults(params.searchTerm);
  const data = await wikiData;
  const results: Result[] | undefined = data?.query?.pages;

  return (
    <main className="bg-slate-200 mx-auto max-w-lg py-1 min-h-screen">
      {results ? (
        Object.values(results).map((result) => (
          <>
            <Items key={result.pageid} result={result} />
          </>
        ))
      ) : (
        <h2 className="p-2 text-xl">{`${params.searchTerm} Not Found`}</h2>
      )}
    </main>
  );
}
