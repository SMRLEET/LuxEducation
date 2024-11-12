import { AppConfig } from "bi-internal/core";

export const getKoobDataByCfg = async (
  cfg: any,
  data: any,
  callback: any,
  devTag: any
): Promise<Record<string, unknown>[] | undefined> => {
  const {
    koob,
    distinct,
    columns,
    filters,
    sort,
    limit,
    offset,
    options,
    subtotals,
  } = data;
  const url: string = AppConfig.fixRequestUrl("/api/v3/koob/data?" + devTag);

  const body: any = {
    with: koob,
    columns,
    filters,
  };

  body.offset = offset ?? undefined;
  body.limit = limit ?? undefined;
  body.sort = sort ?? undefined;
  body.options = options ?? undefined;
  body.subtotals = subtotals ?? undefined;
  body.distinct = distinct ?? undefined;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: new Headers([
        ["Content-Type", "application/json"],
        ["Accept", "application/stream+json"],
      ]),
      body: JSON.stringify(body),
    });
    let data: string | Array<Record<string, unknown>> = await response.text();

    if (typeof data === "string") {
      data = data
        .split("\n")
        .filter((line: string) => !!line)
        .map((line: string) => JSON.parse(line));
    } else if (data && typeof data === "object" && !Array.isArray(data)) {
      data = [data];
    }

    return callback(data);
  } catch (e) {
    console.log(e);
    return;
  }
};

export const forceResizeCharts = (fn: Function, container?: HTMLDivElement) => {
  const config = {
    attributes: true,
    childList: false,
    subtree: false,
  };

  if (container) {
    const callback = (mutationsList: ResizeObserverEntry[]) => {
      for (const mutation of mutationsList) {
        fn();
      }
    };

    const observer = new ResizeObserver(callback);
    observer.observe(container);
    return observer;
  }
};
