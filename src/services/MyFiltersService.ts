import { BaseService } from "bi-internal/core";
export type FilterValue = (string[] | string | number | number[] | boolean)[];
export interface IMyFiltersServiceModel {
  loading?: boolean;
  error?: string;
  filters: Record<string, FilterValue>;
}
declare global {
  interface Window {
    __myFiltersService: MyFiltersService;
  }
}

export class MyFiltersService extends BaseService<IMyFiltersServiceModel> {
  private constructor() {
    super({
      loading: false,
      error: "",
      filters: {},
    });
  }

  protected _dispose() {
    super._dispose();
  }
  public setFilter(col: string, filter: FilterValue) {
    this._updateWithData({
      filters: {
        ...this.getModel().filters,
        [col]: filter,
      },
    });
  }
  public setFilters(filters: IMyFiltersServiceModel["filters"]) {
    this._updateWithData({ filters });
  }
  public static getInstance = () => {
    if (!window.__myFiltersService) {
      window.__myFiltersService = new MyFiltersService();
    }
    return window.__myFiltersService;
  };
}

