import * as React from "react";

// @ts-ignore
import styles from "./table.module.scss";
import { cn } from "../../../utils";
import { useCallback, useMemo, useState, useEffect } from "react";
import { InputComponent } from "../input";
import { ButtonComponent } from "../button";
import { ChevronDownIconComponent, ChevronUpIconComponent } from "../../icons";

type DataRow = {
  id: string;
} & Object;

type Column = {
  key: string;
  label?: string;
  sortable?: boolean;
};

type Props = {
  title?: string;
  data: DataRow[];
  columns: Column[];
  searchable?: boolean;
  pageRows?: number;
  defaultPage?: number;
};

export const TableComponent: React.FC<Props> = ({
  title = null,
  data = [],
  columns = [],
  pageRows,
  defaultPage = 0,
  searchable = false,
}) => {
  const [pageIndex, setPageIndex] = useState(defaultPage);
  const [searchFilterText, setSearchFilterText] = useState<string>("");
  const [sortMap, setSortMap] = useState({});

  const filteredData = useMemo(
    () =>
      !searchFilterText || searchFilterText?.length === 0
        ? data
        : data.filter((object) =>
            Object.values(object).some((text) =>
              text.includes(searchFilterText),
            ),
          ),
    [data, searchFilterText],
  );

  const sortedData = useMemo(() => {
    const keys = Object.keys(sortMap);

    return [
      ...filteredData.sort((itemA, itemB) => {
        for (let key of keys) {
          const sortOrder = sortMap[key];
          if (sortOrder === 0) continue;

          const comparison =
            itemA[key] > itemB[key] ? 1 : itemA[key] < itemB[key] ? -1 : 0;

          if (comparison !== 0)
            return sortOrder === 1 ? -comparison : comparison;
        }
        return 0;
      }),
    ];
  }, [filteredData, sortMap]);

  const currentData = useMemo(() => {
    const startPageIndex = pageIndex * pageRows;
    const endPageIndex = startPageIndex + pageRows;
    return pageRows
      ? sortedData.slice(startPageIndex, endPageIndex)
      : sortedData;
  }, [sortedData, pageRows, pageIndex]);

  const canGoToPreviousPage = useMemo(() => pageIndex !== 0, [pageIndex]);
  const canGoToNextPage = useMemo(
    () => pageIndex * pageRows + pageRows < sortedData.length,
    [pageRows, pageIndex, sortedData],
  );

  const maxPages = useMemo(
    () => Math.ceil(sortedData.length / pageRows),
    [sortedData, pageRows],
  );

  const onPreviousPage = useCallback(() => {
    if (!canGoToPreviousPage) return;
    setPageIndex((index) => index - 1);
  }, [setPageIndex, canGoToPreviousPage]);

  const onNextPage = useCallback(() => {
    if (!canGoToNextPage) return;
    setPageIndex((index) => index + 1);
  }, [setPageIndex, canGoToNextPage]);

  const onSearchInputChange = useCallback(
    (event) => setSearchFilterText(event.target.value),
    [setSearchFilterText],
  );

  useEffect(() => {
    if (pageIndex === 0) return;
    if (pageIndex * pageRows > sortedData.length) setPageIndex(0);
  }, [pageIndex, pageRows, sortedData]);

  const onClickSortable = useCallback(
    (key: string) => () => {
      setSortMap((sortMap) => {
        let nextSortMap = 1;
        if (sortMap[key] === 1) nextSortMap = 2;
        if (sortMap[key] === 2) nextSortMap = 0;
        return {
          ...sortMap,
          [key]: nextSortMap,
        };
      });
    },
    [setSortMap],
  );

  return (
    <div className={styles.table}>
      {searchable || title ? (
        <div className={styles.title}>
          {title ? (
            <label>
              {title} ({filteredData.length})
            </label>
          ) : (
            <div />
          )}
          {searchable ? (
            <InputComponent
              wrapperClassName={styles.wrapperInput}
              className={styles.input}
              onChange={onSearchInputChange}
              value={searchFilterText}
            />
          ) : (
            <div />
          )}
        </div>
      ) : null}
      <div className={styles.columnsWrapper}>
        <div className={styles.columns}>
          {columns.map(($column) => {
            return (
              <div key={$column.key} className={styles.column}>
                <div className={cn(styles.item, styles.header)}>
                  <label>{$column?.label ?? $column.key}</label>
                  {$column.sortable ? (
                    <div
                      className={styles.sortable}
                      onClick={onClickSortable($column.key)}
                    >
                      <ChevronUpIconComponent
                        className={cn(styles.sortUpIcon, {
                          [styles.sortDisabled]: sortMap[$column.key] !== 2,
                        })}
                      />
                      <ChevronDownIconComponent
                        className={cn(styles.sortDownIcon, {
                          [styles.sortDisabled]: sortMap[$column.key] !== 1,
                        })}
                      />
                    </div>
                  ) : null}
                </div>
                {currentData.map(($row) => (
                  <div key={$row.id + $column.key} className={styles.item}>
                    {$row[$column.key]}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
      {pageRows ? (
        <div className={styles.navigation}>
          <ButtonComponent
            className={styles.button}
            onClick={onPreviousPage}
            color="grey"
            style={{
              visibility: canGoToPreviousPage ? "visible" : "hidden",
            }}
          >
            Previous
          </ButtonComponent>

          <div className={styles.number}>
            {pageIndex + 1}/{maxPages}
          </div>
          <ButtonComponent
            className={styles.button}
            onClick={onNextPage}
            color="grey"
            style={{
              visibility: canGoToNextPage ? "visible" : "hidden",
            }}
          >
            Next
          </ButtonComponent>
        </div>
      ) : null}
    </div>
  );
};