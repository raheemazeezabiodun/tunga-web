import React from 'react';
import {Link, NavLink} from 'react-router-dom';
import {Panel, Accordion} from 'react-bootstrap';
import Progress from './status/Progress';
import LoadMore from './status/LoadMore';

export default class SupportPageList extends React.Component {
  componentDidMount() {
    const {search} = this.props;
    let section = this.getSectionSlug();
    if (section) {
      this.props.SupportActions.retrieveSupportSection(section);
    }
    this.props.SupportActions.listSupportPages({
      section,
      search,
      tag: this.getFilterTag(),
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.search != this.props.search ||
      (this.props.params &&
        prevProps.params.section != this.props.params.section) ||
      (this.props.params && prevProps.params.tag != this.props.params.tag)
    ) {
      const {search} = this.props;
      let section = this.getSectionSlug();
      this.props.SupportActions.listSupportPages({
        section,
        search,
        tag: this.getFilterTag(),
      });
    }
  }

  getSectionSlug() {
    const {params} = this.props;
    return params ? params.section : null;
  }

  getFilterTag() {
    const {params} = this.props;
    return params ? params.tag : null;
  }

  render() {
    const {Support, SupportActions, hide_header} = this.props;
    const {section} = Support.Section.detail;

    return (
      <div>
        {hide_header
          ? null
          : <div>
              <ol className="breadcrumb">
                <li>
                  <Link to={`/support/`}>Support</Link>
                </li>
                <li className="active">
                  {section.title}
                </li>
              </ol>
              {section.tags
                ? <ul className="nav nav-pills nav-top-filter">
                    <li role="presentation">
                      <NavLink
                        to={`/support/${this.getSectionSlug()}`}
                        activeClassName="active">
                        All
                      </NavLink>
                    </li>
                    {section.tags.map(tag => {
                      return (
                        <li role="presentation" key={tag.slug}>
                          <NavLink
                            to={`/support/${this.getSectionSlug()}/tag/${tag.slug}`}
                            activeClassName="active">
                            {tag.name}
                          </NavLink>
                        </li>
                      );
                    })}
                  </ul>
                : null}
            </div>}
        {Support.Page.list.isFetching
          ? <Progress />
          : <div>
              <div className="row flex-row">
                {Support.Page.list.pages.map(page => {
                  return (
                    <div key={page.id} className="col-md-6">
                      <div className="support-card">
                        <a
                          href={`#${page.section.slug}_${page.slug}`}
                          className="title"
                          data-toggle="collapse"
                          data-target={`#${page.section.slug}_${page.slug}`}>
                          <i className="fa fa-caret-right" /> {page.title}
                        </a>
                        <div
                          id={`${page.section.slug}_${page.slug}`}
                          className="collapse">
                          <div
                            className="details"
                            dangerouslySetInnerHTML={{__html: page.content}}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <LoadMore
                url={Support.Page.list.next}
                callback={SupportActions.listMoreSupportPages}
                loading={Support.Page.list.isFetchingMore}
              />
              {Support.Page.list.pages.length
                ? null
                : <div className="alert alert-info">No pages to display</div>}
            </div>}
      </div>
    );
  }
}
