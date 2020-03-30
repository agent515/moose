import React, { memo, useCallback } from "react";
import styles from "./Header.module.scss";
import Icon from "@mdi/react";
import { mdiCloseCircle, mdiCog, mdiFolderDownload, mdiMagnify } from "@mdi/js";
import { ipcRenderer } from "electron";
import { ViewState } from "@enums/ViewState";
import cn from "classnames";
import { TorrentResult } from "../../../types/TorrentResult";

export interface IResults {
  results: TorrentResult[];
  query: string;
}

interface IProps {
  onResultsChange: (results: IResults) => void;
  setViewState: (viewState: ViewState) => void;
  viewState: ViewState;
}

export const Header: React.FC<IProps> = memo(
  ({ onResultsChange, setViewState, viewState }) => {
    return (
      <div className={styles.header}>
        <div></div>
        <Navbar viewState={viewState} setViewState={setViewState} />
        <Search setViewState={setViewState} onResultsChange={onResultsChange} />
      </div>
    );
  }
);

const Navbar: React.FC<Omit<IProps, "onResultsChange">> = memo(
  ({ setViewState, viewState }) => {
    return (
      <div className={styles.navbar}>
        <button
          className={
            viewState === ViewState.SEARCH ? styles.navbarActive : undefined
          }
          onClick={() => setViewState(ViewState.SEARCH)}
        >
          <Icon path={mdiMagnify} title="Search for Torrents" size={0.72} />
        </button>
        <button
          className={
            viewState === ViewState.DOWNLOADS ? styles.navbarActive : undefined
          }
          onClick={() => setViewState(ViewState.DOWNLOADS)}
        >
          <Icon
            path={mdiFolderDownload}
            title="Download Torrents"
            size={0.72}
          />
        </button>
        <button>
          <Icon path={mdiCog} title="Settings" size={0.72} />
        </button>
      </div>
    );
  }
);

const Search: React.FC<Omit<IProps, "viewState">> = memo(
  ({ onResultsChange, setViewState }) => {
    const [query, setQuery] = React.useState("");

    const fetchResults = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && query.length) {
          (async function () {
            const results = await ipcRenderer.invoke("getTorrents", query);
            console.log(results);
            setViewState(ViewState.SEARCH);
            onResultsChange({
              results,
              query,
            });
          })();
        }
      },
      [query]
    );

    return (
      <div className={styles.search}>
        <Icon
          className={styles.searchIcon}
          size={0.7}
          path={mdiMagnify}
          title="Search"
        />
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search"
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={fetchResults}
          value={query}
        />

        {!!query.length && (
          <Icon
            className={styles.closeIcon}
            size={0.5}
            path={mdiCloseCircle}
            title="Search"
            onClick={() => setQuery("")}
          />
        )}
      </div>
    );
  }
);