/* eslint-env jest, jasmine */
/* eslint-disable comma-dangle */

import {SearchParameters} from 'algoliasearch-helper';
import connect from './connectInfiniteHits.js';
jest.mock('../core/createConnector');

describe.only('connectInfiniteHits', () => {
  it('provides the current hits to the component', () => {
    const providedThis = {};
    const hits = [{}];
    const props = connect.getProps.call(providedThis, null, null, {
      results: {hits, page: 0, hitsPerPage: 2, nbPages: 3},
    });
    expect(props.hits).toEqual(hits);
  });

  it('accumulate hits internally', () => {
    const providedThis = {};
    const hits = [{}, {}];
    const hits2 = [{}, {}];
    connect.getProps.call(providedThis, null, null, {results: {hits, page: 0, hitsPerPage: 2, nbPages: 3}});
    const props = connect.getProps.call(providedThis, null, null, {
      results: {hits: hits2, page: 1, hitsPerPage: 2, nbPages: 3}
    });
    expect(props.hits).toEqual([...hits, ...hits2]);
    expect(props.isLastPage).toBe(false);
  });

  it('Indicates the last page after several pages', () => {
    const providedThis = {};
    const hits = [{}, {}];
    const hits2 = [{}, {}];
    const hits3 = [{}];
    connect.getProps.call(providedThis, null, null, {results: {hits, page: 0, hitsPerPage: 2, nbPages: 3}});
    connect.getProps.call(providedThis, null, null, {results: {hits: hits2, page: 1, hitsPerPage: 2, nbPages: 3}});
    const props = connect.getProps.call(providedThis, null, null, {
      results: {hits: hits3, page: 2, hitsPerPage: 2, nbPages: 3}
    });
    expect(props.hits).toEqual([...hits, ...hits2, ...hits3]);
    expect(props.isLastPage).toBe(true);
  });

  it('use the state for hitsPerPage, defaults to props, ', () => {
    const params = new SearchParameters();
    const params2 = connect.getSearchParameters(params, {hitsPerPage: 666}, {});
    expect(params2.hitsPerPage).toBe(666);
    const params3 = connect.getSearchParameters(params2, {hitsPerPage: 777}, {});
    expect(params3.hitsPerPage).toBe(666);
  });

  it('adds 1 to page when calling refine', () => {
    const props = {id: 'pager'};

    const state0 = {};

    const state1 = connect.refine(props, state0);
    expect(state1).toEqual({pager: {page: 1}});

    const state2 = connect.refine(props, state1);
    expect(state2).toEqual({pager: {page: 2}});
  });
});
