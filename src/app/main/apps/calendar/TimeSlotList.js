import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Checkbox from '@material-ui/core/Checkbox';
import Avatar from '@material-ui/core/Avatar';
import moment from 'moment';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    height: 200,
    overflow: 'auto',
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function TimeSlotList({start, end}) {
    const classes = useStyles();
    const [checked, setChecked] = React.useState([1]);
    const [slots, setTimeSlots] = React.useState([]);

    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
        newChecked.push(value);
        } else {
        newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    const buildTimeSlots = (start, end) => {
        console.log(start)
        let timeFormat = 'HH:mm a';
        let startTime = moment(start, timeFormat);
        let endTime = moment(end, timeFormat);
        let hour = startTime.hour();
        let minutes = startTime.minute();
        let nextStartTime, nextEndTime;
        let timeslots = [];
        do {
            if (minutes >= 0 && minutes < 30) {
                nextStartTime = moment(moment(hour, 'HH').add(30, 'minutes'), timeFormat);
            } else if (minutes >= 30 && minutes < 60) {
                nextStartTime = moment(hour, 'HH').add(1, 'hours');
            }
            nextEndTime = moment(moment(nextStartTime, timeFormat).add(20, 'minutes'), timeFormat);
            timeslots.push({nextStartTime, nextEndTime})
            hour = nextStartTime.hour();
            minutes = nextStartTime.minute();
        } while (nextEndTime <= endTime)
        // console.log(timeslots)
        setTimeSlots(timeslots)
    }

    React.useEffect(() => {
        if (start && end) {
            buildTimeSlots(start, end)
        }
    }, [start, end])

    return (
        <List dense className={classes.root}>
        {slots.map(({nextStartTime, nextEndTime}) => {
            const timeFormat = 'HH:mm';
            let startTime = moment(nextStartTime).format(timeFormat);
            let endTime = moment(nextEndTime).format(timeFormat);
            const labelId = `checkbox-list-secondary-label-${startTime}`;
            return (
            <ListItem key={startTime} button className={'rounded-8 border-1 border-color'}>
                <ListItemText id={labelId} primary={`${startTime} - ${endTime}`} />
                <ListItemSecondaryAction>
                <Checkbox
                    edge="end"
                    onChange={handleToggle(startTime)}
                    checked={checked.indexOf(startTime) !== -1}
                    inputProps={{ 'aria-labelledby': labelId }}
                />
                </ListItemSecondaryAction>
            </ListItem>
            );
        })}
        </List>
    );
}
