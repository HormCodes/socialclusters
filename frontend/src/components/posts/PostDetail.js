import React from "react";
import {compose, withHandlers, withState} from "recompose";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import ChipInput from "material-ui-chip-input";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import * as PropTypes from "prop-types";

let PostDetail = ({opened, detailsContent, handleSave, handleClose, content, post, topics, topicOptions, handleChange}) =>
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
        defaultValue={topics}
        onChange={(chips) => handleChange(chips)}
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

export default compose(
  withState('topics', 'updateTopics', props => props.topics),
  withHandlers({
    handleChange: props => (chips) => {
      console.log(chips)
      props.updateTopics(chips)
    },
    handleSave: props => event => {
      event.preventDefault()
      props.handleSaveTopics(props.post._id, props.topics)
    }
  })
)(PostDetail)
