import React from "react";
import {compose, withHandlers, withState} from "recompose";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import ChipInput from "material-ui-chip-input";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import * as PropTypes from "prop-types";

let PostDetail = ({opened, detailsContent, handleSave, handleClose, content, post, topics, topicOptions, handleAdd, handleDelete}) =>
  <Dialog
    fullScreen={false}
    open={opened}
    onClose={handleClose}
    aria-labelledby="responsive-dialog-title"
  >
    <DialogTitle id="responsive-dialog-title">Post</DialogTitle>
    <DialogContent>
      {content}

      <br/>

      <ChipInput
        fullWidth
        dataSource={topics}
        value={topics}
        onAdd={(chip) => handleAdd(chip)}
        onDelete={(chip, index) => handleDelete(chip, index)}
      />
    </DialogContent>
    <DialogActions>
      <Button onClick={handleClose} color="primary">
        Cancel
      </Button>
      <Button onClick={handleSave} color="primary" autoFocus>
        Save
      </Button>
    </DialogActions>
  </Dialog>

PostDetail.propTypes = {
  topics: PropTypes.array.isRequired,
  topicOptions: PropTypes.array.isRequired,
  handleSaveTopics: PropTypes.func.isRequired,
  content: PropTypes.element.isRequired,
}

function isTopicUnknown(topicOptions, chip) {
  return topicOptions.map(topic => topic.name).indexOf(chip) === -1;
}

export default compose(
  withState('topics', 'updateTopics', props => props.topics),
  withHandlers({
    handleAdd: props => (chip) => {

      if (isTopicUnknown(props.topicOptions, chip)) {
        console.log("Unknown topic"); // TODO - Replace by Snackbar https://material-ui.com/demos/snackbars/
        return;
      }

      let newTopics = props.topics.concat([chip])
      props.updateTopics(newTopics)
    },
    handleDelete: props => (chip, index) => {

      let newTopics = props.topics.filter(topic => topic === chip);
      props.updateTopics(newTopics)
    },
    handleSave: props => event => {
      event.preventDefault()
      props.handleSaveTopics(props.post._id, props.topics)
    }
  })
)(PostDetail)
