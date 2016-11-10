/* eslint-env jest, jasmine */

import React from 'react';

import InfiniteHits from './InfiniteHits';

import {mount, render} from 'enzyme';

describe('InfiniteHits', () => {
  it('accepts a itemComponent prop', () => {
    const hits = [{objectID: 0}, {objectID: 1}, {objectID: 2}];
    const Hit = 'Hit';
    const tree = render(
      <InfiniteHits
        itemComponent={Hit}
        hits={hits}
        isLastPage={false}
        refine={() => undefined}
      />
    );
    expect(tree).toMatchSnapshot();
  });

  it('calls refine when the load more button is clicked', () => {
    const mockedRefine = jest.fn();
    const hits = [{objectID: 0}, {objectID: 1}, {objectID: 2}];
    const Hit = 'Hit';
    const wrapped = mount(
      <InfiniteHits
        refine={mockedRefine}
        itemComponent={Hit}
        hits={hits}
        isLastPage={false}
      />
    );
    expect(mockedRefine.mock.calls.length).toBe(0);
    wrapped.find('button').simulate('click');
    expect(mockedRefine.mock.calls.length).toBe(1);
  });

  it('Button is disabled when it is the last page', () => {
    const hits = [{objectID: 0}, {objectID: 1}, {objectID: 2}];
    const Hit = 'Hit';
    const wrapped = mount(
      <InfiniteHits
        refine={() => undefined}
        itemComponent={Hit}
        hits={hits}
        isLastPage={true}
      />
    );
    expect(wrapped.find('button').props().disabled).toBe(true);
  });
});
