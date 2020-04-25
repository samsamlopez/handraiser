import React from 'react';
import Popper from '@material-ui/core/Popper';
import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';
import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

export default function Emoji(props) {
  const {
    anchorEl,
    handleEmoji,
    openPicker
  } = props
  const open = Boolean(anchorEl);
  return (
      <div>
          <Popper open={open} anchorEl={anchorEl} transition>
            {({ TransitionProps }) => (
              <Fade {...TransitionProps} timeout={350}>
                <ClickAwayListener onClickAway={() => openPicker()}>
                  <Paper> 
                  <Picker 
                  onSelect={handleEmoji}
                  emojiTooltip={true}
                  emoji=''
                  title=""    
                  />
                  </Paper>
                </ClickAwayListener>
              </Fade>
            )}
          </Popper>
      </div>
  );
}