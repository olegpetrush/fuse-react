import { useForm } from '@fuse/hooks';
import FuseUtils from '@fuse/utils/FuseUtils';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { DatePicker, TimePicker } from '@material-ui/pickers';
import moment from 'moment';
import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeEvent, updateEvent, addEvent, closeNewEventDialog, closeEditEventDialog } from './store/eventsSlice';

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import TimeSlotList from './TimeSlotList';

const defaultFormState = {
	id: FuseUtils.generateGUID(),
	title: '',
	allDay: true,
	start: moment(new Date(), 'MM/DD/YYYY'),
	end: moment(new Date(), 'MM/DD/YYYY'),
	desc: ''
};

function EventDialog(props) {
	const [title, setTitle] = React.useState('');
	const dispatch = useDispatch();
	const eventDialog = useSelector(({ calendarApp }) => calendarApp.events.eventDialog);
	const { form, handleChange, setForm, setInForm } = useForm(defaultFormState);

	const initDialog = useCallback(() => {
		/**
		 * Dialog type: 'edit'
		 */
		if (eventDialog.type === 'edit' && eventDialog.data) {
			setForm({ ...eventDialog.data });
		}

		/**
		 * Dialog type: 'new'
		 */
		if (eventDialog.type === 'new') {
			setForm({
				...defaultFormState,
				...eventDialog.data,
				id: FuseUtils.generateGUID()
			});
		}
	}, [eventDialog.data, eventDialog.type, setForm]);

	useEffect(() => {
		/**
		 * After Dialog Open
		 */
		if (eventDialog.props.open) {
			initDialog();
		}
	}, [eventDialog.props.open, initDialog]);

	function closeComposeDialog() {
		return eventDialog.type === 'edit' ? dispatch(closeEditEventDialog()) : dispatch(closeNewEventDialog());
	}

	function canBeSubmitted() {
		return true; //form.title.length > 0;
	}

	function handleSubmit(event) {
		event.preventDefault();

		if (eventDialog.type === 'new') {
			dispatch(addEvent(form));
		} else {
			dispatch(updateEvent(form));
		}
		closeComposeDialog();
	}

	function handleRemove() {
		dispatch(removeEvent(form.id));
		closeComposeDialog();
	}

	function handleChangeSelect(event) {
		setTitle(event.target.value);
	};

	return (
		<Dialog
			{...eventDialog.props}
			onClose={closeComposeDialog}
			fullWidth
			maxWidth="xs"
			component="form"
			classes={{
				paper: 'rounded-8 overflow-hidden'
			}}
		>
			<AppBar position="static" color={eventDialog.type === 'new' ? 'primary' : 'secondary'}>
				<Toolbar className="flex w-full">
					<Typography variant="subtitle1" color="inherit">
						{eventDialog.type === 'new' ? 'New Event' : 'Edit Event'}
					</Typography>
				</Toolbar>
			</AppBar>

			<form noValidate onSubmit={handleSubmit}>
				<DialogContent classes={{ root: 'p-16 pb-0 sm:p-24 sm:pb-0' }}>
					<FormControl variant="outlined" className={'mt-8 mb-16 w-full'}>
						<InputLabel id="demo-simple-select-outlined-label">Title</InputLabel>
						<Select
							labelId="demo-simple-select-outlined-label"
							id="demo-simple-select-outlined"
							value={title}
							onChange={handleChangeSelect}
							label="Title"
						>
							<MenuItem value="">
								<em>None</em>
							</MenuItem>
							<MenuItem value={10}>Title1</MenuItem>
							<MenuItem value={20}>Title2</MenuItem>
							<MenuItem value={30}>Title3</MenuItem>
						</Select>
					</FormControl>

					{/* <TextField
						id="title"
						label="Title"
						className="mt-8 mb-16"
						InputLabelProps={{
							shrink: true
						}}
						name="title"
						value={form.title}
						onChange={handleChange}
						variant="outlined"
						autoFocus
						required
						fullWidth
					/> */}

					<DatePicker
						label="Day"
						inputVariant="outlined"
						value={form.day}
						onChange={day => setInForm('day', day)}
						className="mt-8 mb-16 w-full"
					/>
					{/* <FormControlLabel
						className="mt-8 mb-16"
						label="All Day"
						control={<Switch checked={form.allDay} id="allDay" name="allDay" onChange={handleChange} />}
					/> */}

					<div className="flex justify-between">
						<TimePicker
							label="Start"
							inputVariant="outlined"
							value={form.start}
							onChange={date => setInForm('start', date)}
							className="mt-8 mb-16"
							maxDate={form.end}
							invalidDateMessage={false}
						/>

						<TimePicker
							label="End"
							inputVariant="outlined"
							value={form.end}
							onChange={date => setInForm('end', date)}
							className="mt-8 mb-16"
							minDate={form.start}
							invalidDateMessage={false}
						/>
					</div>

					<FormControl variant="outlined" className={'mt-8 mb-16 w-full'}>
						<InputLabel id="demo-simple-select-outlined-label">Title</InputLabel>
						<Select
							labelId="demo-simple-select-outlined-label"
							id="demo-simple-select-outlined"
							value={title}
							onChange={handleChangeSelect}
							label="Title"
						>
							<MenuItem value="">
								<em>None</em>
							</MenuItem>
							<MenuItem value={10}>Title1</MenuItem>
							<MenuItem value={20}>Title2</MenuItem>
							<MenuItem value={30}>Title3</MenuItem>
						</Select>
					</FormControl>

					<TimeSlotList start={'06:00 AM'} end={'06:00 PM'}/>
					{/* <TextField
						className="mt-8 mb-16"
						id="desc"
						label="Description"
						type="text"
						name="desc"
						value={form.desc}
						onChange={handleChange}
						multiline
						rows={5}
						variant="outlined"
						fullWidth
					/> */}
				</DialogContent>

				{eventDialog.type === 'new' ? (
					<DialogActions className="justify-between px-8 sm:px-16">
						<Button variant="contained" color="primary" type="submit" disabled={!canBeSubmitted()}>
							Add
						</Button>
					</DialogActions>
				) : (
					<DialogActions className="justify-between px-8 sm:px-16">
						<Button variant="contained" color="primary" type="submit" disabled={!canBeSubmitted()}>
							Save
						</Button>
						<IconButton onClick={handleRemove}>
							<Icon>delete</Icon>
						</IconButton>
					</DialogActions>
				)}
			</form>
		</Dialog>
	);
}

export default EventDialog;
