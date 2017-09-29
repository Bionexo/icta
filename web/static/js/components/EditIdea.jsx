import React from 'react';
import PropTypes from 'prop-types';
import { Translate, I18n } from 'react-redux-i18n';

import SimpleMDE from 'simplemde';

class EditIdea extends React.Component {
  constructor(props) {
    super(props);
    this.state = { currentIdea: this.props.idea };

    this.onSubmit = this.onSubmit.bind(this);
    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.props.getAllUsers();
  }

  componentDidMount() {
    const simplemde = new SimpleMDE({ forceSync: true });
    this.simplemde = simplemde;

    const onChangeArea = () => {
      const currentIdea = this.state.currentIdea;
      currentIdea.body = simplemde.value();
      this.setState({ currentIdea });
    };

    onChangeArea.bind(this);
    simplemde.codemirror.on('change', onChangeArea);
  }

  onSubmit(e) {
    e.preventDefault();
    this.props.onEditIdea(this.state.currentIdea);
  }

  handleFieldChange(field) {
    return (event) => {
      const currentIdea = this.state.currentIdea;
      currentIdea[field] = event.target.value;
      this.setState({ currentIdea });
    };
  }

  render() {
    const idea = this.props.idea;
    const users = this.props.users;
    const currentUser = this.props.currentUser;

    return (
      <div className="col-sm-12">
        <form onSubmit={this.onSubmit}>
          <div className="form-group">
            <label htmlFor="title"><Translate value="idea.title" /></label>
            <input
              value={idea.title}
              type="text"
              className="form-control"
              placeholder={I18n.t('idea.title')}
              onChange={this.handleFieldChange('title')}
            />
          </div>
          <div className="form-group">
            <label htmlFor="owner"><Translate value="idea.owner" /></label>
            { users === 'loading' ?
              'Loading'
              :
              <select defaultValue={idea.owner.id} onChange={this.handleFieldChange('owner_id')} className="form-control">
                <option key="" value="">Nenhum</option>
                { users.map(u => (<option key={u.id} value={u.id}> {u.name}</option>)) }
              </select>
            }
          </div>
          { currentUser.kind === 'admin' ?
            <div className="form-group">
              <label htmlFor="status"><Translate value="idea.status" /></label>
              <select value={idea.status} onChange={this.handleFieldChange('status')} className="form-control">
                <option value="new">{I18n.t('idea.statuses.new')}</option>
                <option value="planned">{I18n.t('idea.statuses.planned')}</option>
                <option value="in_progress">{I18n.t('idea.statuses.in_progress')}</option>
                <option value="done">{I18n.t('idea.statuses.done')}</option>
              </select>
            </div> : ''
          }
          <div className="form-group">
            <label htmlFor="category"><Translate value="idea.category" /></label>
            <select value={idea.category} onChange={this.handleFieldChange('category')} className="form-control">
              <option value="business">{I18n.t('idea.categories.business')}</option>
              <option value="company">{I18n.t('idea.categories.company')}</option>
              <option value="office">{I18n.t('idea.categories.office')}</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="body"><Translate value="idea.body" /></label>
            <textarea rows="4" value={idea.body} onChange={this.handleFieldChange('body')} />
          </div>
          <button type="submit" className="btn btn-primary pull-right">
            <Translate value="idea.save" />
          </button>
        </form>
      </div>
    );
  }
}

EditIdea.propTypes = {
  idea: PropTypes.shape({
    title: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
    owner: PropTypes.shape({
      id: PropTypes.number.isRequired,
    }),
  }).isRequired,
  users: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })),
  ]).isRequired,
  getAllUsers: PropTypes.func.isRequired,
  onEditIdea: PropTypes.func.isRequired,
  currentUser: PropTypes.shape({
    kind: PropTypes.string.isRequired,
  }).isRequired,
};

export default EditIdea;
