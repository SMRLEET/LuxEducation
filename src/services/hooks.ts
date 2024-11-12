import { useCallback, useEffect, useState } from "react";
import { IMyFiltersServiceModel, MyFiltersService } from "./MyFiltersService";

export const useMyFiltersService = () => {
  const filtersService = MyFiltersService.getInstance();
  const [filtersModel, setFiltersModel] = useState<IMyFiltersServiceModel>(
    filtersService.getModel()
  );
  const handleModelUpdated = useCallback(
    (newFiltersModel: IMyFiltersServiceModel) => {
      setFiltersModel(newFiltersModel);
    },
    [filtersService]
  );
  useEffect(() => {
    filtersService.subscribeUpdatesAndNotify(handleModelUpdated);
    return () => {
      filtersService.unsubscribe(handleModelUpdated);
    };
  }, [filtersService, handleModelUpdated]);
  return {
    filtersModel,
    filtersService,
  };
};
