import React from 'react';
import PropTypes from 'prop-types';
import SimpleMDE from 'simplemde';
import { Translate, I18n } from 'react-redux-i18n';

class NewIdea extends React.Component {
  constructor(props) {
    super(props);
    this.state = { acceptedTerms: false, title: '', body: '', category: 'business' };

    this.onSubmit = this.onSubmit.bind(this);
    this.handleTermsChange = this.handleTermsChange.bind(this);
    this.handleFieldChange = this.handleFieldChange.bind(this);
  }

  componentDidMount() {
    const simplemde = new SimpleMDE({ forceSync: true });
    this.simplemde = simplemde;

    const onChangeArea = () => {
      const state = this.state;
      state.body = simplemde.value();
      this.setState(state);
    };

    onChangeArea.bind(this);
    simplemde.codemirror.on('change', onChangeArea);
  }

  onSubmit(e) {
    const { title, body, category } = this.state;

    e.preventDefault();
    if (!title.trim()) {
      return;
    }

    this.props.onAddIdea(title, body, category);
  }

  handleFieldChange(field) {
    return (event) => {
      const state = { ...this.state };
      state[field] = event.target.value;
      this.setState(state);
    };
  }

  handleTermsChange(e) {
    this.setState({
      ...this.state,
      acceptedTerms: e.target.checked,
    });
  }

  render() {
    const termsUrl = window.termsUrl;

    const TermsCheck = ({ handleTermsChange, acceptedTerms }) => (
      <label htmlFor="chk-terms">
        <input
          name="chk-terms"
          type="checkbox"
          onChange={handleTermsChange}
          checked={acceptedTerms}
        />&nbsp;
        <Translate value="idea.terms" url={termsUrl} dangerousHTML />
      </label>
    );

    return (
      <div className="col-sm-12">
        <form onSubmit={this.onSubmit}>
          <div className="form-group">
            <label htmlFor="title"><Translate value="idea.title" /></label>
            <input
              type="text"
              className="form-control"
              id="title"
              placeholder={I18n.t('idea.title')}
              onChange={this.handleFieldChange('title')}
            />
          </div>
          <div className="form-group">
            <label htmlFor="category"><Translate value="idea.category" /></label>
            <select onChange={this.handleFieldChange('category')} className="form-control">
              <option value="office">{I18n.t('idea.categories.office')}</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="body"><Translate value="idea.body" /></label>
            <textarea onChange={this.handleFieldChange('body')} id="body" rows="4" value={this.state.body} />
          </div>
          <div className="row">
            <div className="col-xs-12 col-lg-8">
              {termsUrl !== '' ?
                <TermsCheck
                  handleTermsChange={this.handleTermsChange}
                  acceptedTerms={this.state.acceptedTerms}
                /> : ''}
            </div>
            <div className="col-xs-12 col-lg-3 pull-right">
              <button type="submit" className="btn btn-primary pull-right" disabled={termsUrl !== '' && !this.state.acceptedTerms} ><Translate value="idea.new" /></button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

NewIdea.propTypes = {
  onAddIdea: PropTypes.func.isRequired,
};

export default NewIdea;
