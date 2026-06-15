import { useState } from '@lynx-js/react'
import type { ReactNode } from '@lynx-js/react'

import './App.css'
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  AddIcon,
  Alert,
  AlertTitle,
  AppBar,
  ArrowBackIcon,
  Avatar,
  AvatarGroup,
  Badge,
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Checkbox,
  CheckCircleIcon,
  CircularProgress,
  Chip,
  CloseIcon,
  Container,
  DeleteIcon,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  ExpandMoreIcon,
  FavoriteIcon,
  FormControlLabel,
  IconButton,
  iconPaths,
  LinearProgress,
  Link,
  List,
  ListItem,
  ListItemText,
  MenuIcon,
  Paper,
  Radio,
  Rating,
  SearchIcon,
  SettingsIcon,
  Skeleton,
  Stack,
  StarIcon,
  SvgIcon,
  Switch,
  Tab,
  Tabs,
  ToggleButton,
  Toolbar,
  Tooltip,
  Typography,
  WarningIcon,
} from './lynx-mui/index.js'
// Batch J — Button family.
import { ButtonGroup, Fab, ToggleButtonGroup } from './lynx-mui/index.js'
// Batch L — Table family.
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  TableSortLabel,
} from './lynx-mui/index.js'
// Batch O — Pagination & BottomNavigation.
import {
  BottomNavigation,
  BottomNavigationAction,
  HomeIcon,
  Pagination,
  PersonIcon,
} from './lynx-mui/index.js'
// Batch N — Stepper family.
import {
  MobileStepper,
  Step,
  StepButton,
  StepContent,
  StepLabel,
  Stepper,
} from './lynx-mui/index.js'

function SectionTitle(props: { children: string }) {
  return (
    <Typography
      variant='overline'
      sx={{ color: 'text.secondary', mt: 3, mb: 1 }}
    >
      {props.children}
    </Typography>
  )
}

function Row(props: { children: ReactNode }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 1, mb: 1 }}>
      {props.children}
    </Box>
  )
}

export function App() {
  const [count, setCount] = useState(0)
  const [tabValue, setTabValue] = useState(0)
  const [checkboxOn, setCheckboxOn] = useState(true)
  const [radioValue, setRadioValue] = useState('a')
  const [switchOn, setSwitchOn] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [accordionExpanded, setAccordionExpanded] = useState(false)

  return (
    <scroll-view scroll-orientation='vertical' style={{ height: '100vh' }}>
      <Box sx={{ p: 2, bgcolor: 'background.default' }}>
        <Typography variant='h4' gutterBottom>lynx-mui gallery</Typography>
        <Typography variant='body2' sx={{ color: 'text.secondary', mb: 2 }}>
          对照 MUI 默认主题 · 工厂化组件
        </Typography>

        <SectionTitle>Typography</SectionTitle>
        <Typography variant='h1'>h1</Typography>
        <Typography variant='h2'>h2</Typography>
        <Typography variant='h3'>h3</Typography>
        <Typography variant='h4'>h4</Typography>
        <Typography variant='h5'>h5</Typography>
        <Typography variant='h6'>h6</Typography>
        <Typography variant='subtitle1'>subtitle1</Typography>
        <Typography variant='subtitle2'>subtitle2</Typography>
        <Typography variant='body1'>body1 — The quick brown fox jumps over the lazy dog.</Typography>
        <Typography variant='body2'>body2 — The quick brown fox jumps over the lazy dog.</Typography>
        <Typography variant='caption'>caption</Typography>
        <Typography variant='overline'>overline</Typography>

        <SectionTitle>Button · contained</SectionTitle>
        <Row>
          <Button variant='contained' color='primary'>Primary</Button>
          <Button variant='contained' color='secondary'>Secondary</Button>
          <Button variant='contained' color='error'>Error</Button>
          <Button variant='contained' color='success'>Success</Button>
          <Button variant='contained' disabled>Disabled</Button>
        </Row>

        <SectionTitle>Button · outlined</SectionTitle>
        <Row>
          <Button variant='outlined' color='primary'>Primary</Button>
          <Button variant='outlined' color='secondary'>Secondary</Button>
          <Button variant='outlined' color='error'>Error</Button>
          <Button variant='outlined' disabled>Disabled</Button>
        </Row>

        <SectionTitle>Button · text</SectionTitle>
        <Row>
          <Button variant='text' color='primary'>Primary</Button>
          <Button variant='text' color='secondary'>Secondary</Button>
          <Button variant='text' disabled>Disabled</Button>
        </Row>

        <SectionTitle>Button · sizes</SectionTitle>
        <Row>
          <Button variant='contained' size='small'>Small</Button>
          <Button variant='contained' size='medium'>Medium</Button>
          <Button variant='contained' size='large'>Large</Button>
        </Row>

        <SectionTitle>Button · interactive</SectionTitle>
        <Row>
          <Button variant='contained' onClick={() => { setCount((c) => c + 1) }}>
            Tapped {`${count}`}
          </Button>
        </Row>

        <SectionTitle>Box · sx</SectionTitle>
        <Row>
          <Box sx={{ p: 2, bgcolor: 'primary.main', borderRadius: 1 }}>
            <Typography variant='body2' sx={{ color: 'primary.contrastText' }}>p:2 primary</Typography>
          </Box>
          <Box sx={{ p: 2, bgcolor: 'grey.200', borderRadius: 2 }}>
            <Typography variant='body2'>grey.200 r:2</Typography>
          </Box>
          <Box sx={{ px: 3, py: 1, bgcolor: 'success.main', borderRadius: 4 }}>
            <Typography variant='body2' sx={{ color: 'success.contrastText' }}>pill</Typography>
          </Box>
        </Row>

        <SectionTitle>Paper · elevation</SectionTitle>
        <Row>
          <Paper elevation={0} sx={{ p: 2 }}>
            <Typography variant='body2'>elevation 0</Typography>
          </Paper>
          <Paper elevation={1} sx={{ p: 2 }}>
            <Typography variant='body2'>elevation 1</Typography>
          </Paper>
          <Paper elevation={4} sx={{ p: 2 }}>
            <Typography variant='body2'>elevation 4</Typography>
          </Paper>
          <Paper elevation={8} sx={{ p: 2 }}>
            <Typography variant='body2'>elevation 8</Typography>
          </Paper>
          <Paper variant='outlined' sx={{ p: 2 }}>
            <Typography variant='body2'>outlined</Typography>
          </Paper>
        </Row>

        <SectionTitle>Stack · spacing + Divider</SectionTitle>
        <Paper variant='outlined' sx={{ p: 2 }}>
          <Stack spacing={1}>
            <Typography variant='body2'>Stack item one</Typography>
            <Divider />
            <Typography variant='body2'>Stack item two</Typography>
            <Divider />
            <Typography variant='body2'>Stack item three</Typography>
          </Stack>
        </Paper>
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1, mt: 1 }}>
          <Typography variant='body2'>left</Typography>
          <Divider orientation='vertical' flexItem />
          <Typography variant='body2'>right</Typography>
        </Box>

        <SectionTitle>Chip · filled</SectionTitle>
        <Row>
          <Chip label='Default' />
          <Chip label='Primary' color='primary' />
          <Chip label='Secondary' color='secondary' />
          <Chip label='Success' color='success' />
          <Chip label='Error' color='error' />
        </Row>

        <SectionTitle>Chip · outlined + sizes</SectionTitle>
        <Row>
          <Chip label='Default' variant='outlined' />
          <Chip label='Primary' variant='outlined' color='primary' />
          <Chip label='Info' variant='outlined' color='info' />
          <Chip label='Small' size='small' color='primary' />
          <Chip label='Small outlined' size='small' variant='outlined' color='secondary' />
        </Row>

        <SectionTitle>Container · maxWidth</SectionTitle>
        <Container maxWidth='sm' sx={{ bgcolor: 'grey.100' }}>
          <Typography variant='body2'>Container maxWidth=&quot;sm&quot; (600px), centered with gutters</Typography>
        </Container>

        <SectionTitle>Card · elevation + outlined</SectionTitle>
        <Row>
          <Card sx={{ width: '160px' }}>
            <CardContent>
              <Typography variant='h6'>Card</Typography>
              <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                elevation 1 (default)
              </Typography>
            </CardContent>
            <Divider />
            <CardActions>
              <Button size='small'>Share</Button>
              <Button size='small'>Learn</Button>
            </CardActions>
          </Card>
          <Card variant='outlined' sx={{ width: '160px' }}>
            <CardContent>
              <Typography variant='h6'>Outlined</Typography>
              <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                variant=&quot;outlined&quot;
              </Typography>
            </CardContent>
            <CardActions disableSpacing>
              <Button size='small' color='secondary'>Action</Button>
            </CardActions>
          </Card>
        </Row>

        <SectionTitle>Card · CardHeader + CardMedia + CardActionArea</SectionTitle>
        <Card sx={{ width: '280px', mb: 2 }}>
          <CardHeader
            avatar={
              <Box sx={{ width: 40, height: 40, bgcolor: 'error.main', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant='body2' sx={{ color: 'error.contrastText' }}>R</Typography>
              </Box>
            }
            title='Shrimp and Chorizo Paella'
            subheader='September 14, 2024'
          />
          <CardMedia
            image='https://mui.com/static/images/cards/paella.jpg'
            height={194}
          />
          <CardContent>
            <Typography variant='body2' sx={{ color: 'text.secondary' }}>
              This impressive paella is a perfect party dish.
            </Typography>
          </CardContent>
          <CardActions>
            <Button size='small'>Share</Button>
            <Button size='small'>Learn More</Button>
          </CardActions>
        </Card>

        <SectionTitle>CardActionArea · pressable</SectionTitle>
        <Card sx={{ width: '280px' }}>
          <CardActionArea onClick={() => { setCount((c) => c + 1) }}>
            <CardMedia
              image='https://mui.com/static/images/cards/contemplative-reptile.jpg'
              height={140}
            />
            <CardContent>
              <Typography variant='h6'>Lizard</Typography>
              <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                Lizards are a widespread group of squamate reptiles. Tapped: {`${count}`}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>

        <SectionTitle>Toolbar · regular + dense</SectionTitle>
        <Paper variant='outlined' sx={{ mb: 1 }}>
          <Toolbar>
            <Typography variant='h6'>Title</Typography>
            <Box sx={{ flexGrow: 1 }} />
            <Button color='primary'>Login</Button>
          </Toolbar>
        </Paper>
        <Paper variant='outlined'>
          <Toolbar variant='dense'>
            <Typography variant='subtitle1'>Dense</Typography>
            <Box sx={{ flexGrow: 1 }} />
            <Chip label='beta' size='small' color='info' />
          </Toolbar>
        </Paper>

        <SectionTitle>List · ListItem + ListItemText</SectionTitle>
        <Paper variant='outlined'>
          <List>
            <ListItem>
              <ListItemText primary='Inbox' secondary='12 new messages' />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText primary='Drafts' secondary='Saved locally' />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText primary='Trash' />
            </ListItem>
          </List>
        </Paper>

        <SectionTitle>AppBar · colors</SectionTitle>
        <AppBar color='primary' sx={{ p: 2, mb: 1 }}>
          <Typography variant='h6' sx={{ color: 'primary.contrastText' }}>Primary AppBar</Typography>
        </AppBar>
        <AppBar color='secondary' sx={{ p: 2, mb: 1 }}>
          <Typography variant='h6' sx={{ color: 'secondary.contrastText' }}>Secondary AppBar</Typography>
        </AppBar>
        <AppBar color='default' sx={{ p: 2, mb: 1 }}>
          <Typography variant='h6'>Default AppBar</Typography>
        </AppBar>
        <AppBar color='transparent' elevation={0} sx={{ p: 2, mb: 1, borderWidth: '1px', borderStyle: 'solid', borderColor: 'divider' }}>
          <Typography variant='h6'>Transparent AppBar</Typography>
        </AppBar>

        <SectionTitle>ToggleButton · colors + selected</SectionTitle>
        <Row>
          <ToggleButton value='a'>Default</ToggleButton>
          <ToggleButton value='b' selected>Selected</ToggleButton>
          <ToggleButton value='c' color='primary' selected>Primary</ToggleButton>
          <ToggleButton value='d' color='secondary' selected>Secondary</ToggleButton>
          <ToggleButton value='e' disabled>Disabled</ToggleButton>
        </Row>

        <SectionTitle>ToggleButton · sizes</SectionTitle>
        <Row>
          <ToggleButton value='s' size='small'>Small</ToggleButton>
          <ToggleButton value='m' size='medium'>Medium</ToggleButton>
          <ToggleButton value='l' size='large'>Large</ToggleButton>
        </Row>

        <SectionTitle>Link · underline variants</SectionTitle>
        <Row>
          <Link underline='always'>Always underline</Link>
          <Link underline='hover'>Hover (degrades to none)</Link>
          <Link underline='none'>No underline</Link>
        </Row>
        <Row>
          <Link color='secondary'>Secondary</Link>
          <Link color='error'>Error link</Link>
          <Link variant='h6'>h6 variant</Link>
        </Row>

        <SectionTitle>Badge · colors + variants</SectionTitle>
        <Row>
          <Badge badgeContent={4} color='primary'>
            <Box sx={{ width: 40, height: 40, bgcolor: 'grey.300', borderRadius: 1 }} />
          </Badge>
          <Badge badgeContent={10} color='secondary'>
            <Box sx={{ width: 40, height: 40, bgcolor: 'grey.300', borderRadius: 1 }} />
          </Badge>
          <Badge badgeContent={100} color='error'>
            <Box sx={{ width: 40, height: 40, bgcolor: 'grey.300', borderRadius: 1 }} />
          </Badge>
          <Badge badgeContent={0} color='primary' showZero>
            <Box sx={{ width: 40, height: 40, bgcolor: 'grey.300', borderRadius: 1 }} />
          </Badge>
        </Row>

        <SectionTitle>Badge · dot + default</SectionTitle>
        <Row>
          <Badge variant='dot' color='primary'>
            <Box sx={{ width: 40, height: 40, bgcolor: 'grey.300', borderRadius: 1 }} />
          </Badge>
          <Badge variant='dot' color='error'>
            <Box sx={{ width: 40, height: 40, bgcolor: 'grey.300', borderRadius: 1 }} />
          </Badge>
          <Badge badgeContent={5}>
            <Box sx={{ width: 40, height: 40, bgcolor: 'grey.300', borderRadius: 1 }} />
          </Badge>
        </Row>

        <SectionTitle>Dialog pieces</SectionTitle>
        <Paper elevation={8} sx={{ mb: 2 }}>
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogContent>
            <DialogContentText>
              This is a dialog content text demonstrating the DialogContentText component with body1 typography and secondary text color.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button variant='text' color='primary'>Cancel</Button>
            <Button variant='text' color='primary'>OK</Button>
          </DialogActions>
        </Paper>

        <SectionTitle>Dialog pieces · dividers</SectionTitle>
        <Paper elevation={8}>
          <DialogTitle>With Dividers</DialogTitle>
          <DialogContent dividers>
            <DialogContentText>
              This example shows DialogContent with the dividers prop enabled, adding top and bottom borders.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button variant='text' color='primary'>Disagree</Button>
            <Button variant='text' color='primary'>Agree</Button>
          </DialogActions>
        </Paper>

        <SectionTitle>Checkbox · colors + sizes</SectionTitle>
        <Row>
          <Checkbox defaultChecked />
          <Checkbox defaultChecked color='secondary' />
          <Checkbox defaultChecked color='success' />
          <Checkbox defaultChecked color='error' />
          <Checkbox />
          <Checkbox defaultChecked size='small' />
          <Checkbox defaultChecked disabled />
          <Checkbox disabled />
        </Row>
        <Row>
          <FormControlLabel
            control={<Checkbox checked={checkboxOn} onChange={setCheckboxOn} />}
            label={checkboxOn ? 'Checked (tap me)' : 'Unchecked (tap me)'}
          />
        </Row>

        <SectionTitle>Radio · controlled group</SectionTitle>
        <Row>
          <FormControlLabel
            control={<Radio checked={radioValue === 'a'} onChange={() => { setRadioValue('a') }} />}
            label='Option A'
          />
          <FormControlLabel
            control={<Radio checked={radioValue === 'b'} onChange={() => { setRadioValue('b') }} />}
            label='Option B'
          />
          <FormControlLabel
            control={<Radio checked={radioValue === 'c'} onChange={() => { setRadioValue('c') }} color='secondary' />}
            label='Option C'
          />
        </Row>
        <Row>
          <Radio defaultChecked />
          <Radio defaultChecked color='success' size='small' />
          <Radio defaultChecked disabled />
          <Radio disabled />
        </Row>

        <SectionTitle>Switch · colors + sizes</SectionTitle>
        <Row>
          <Switch defaultChecked />
          <Switch defaultChecked color='secondary' />
          <Switch defaultChecked color='success' />
          <Switch defaultChecked color='error' />
          <Switch />
          <Switch defaultChecked size='small' />
          <Switch defaultChecked disabled />
          <Switch disabled />
        </Row>
        <Row>
          <FormControlLabel
            control={<Switch checked={switchOn} onChange={setSwitchOn} />}
            label={switchOn ? 'On' : 'Off'}
          />
        </Row>

        <SectionTitle>FormControlLabel · labelPlacement</SectionTitle>
        <Row>
          <FormControlLabel control={<Checkbox defaultChecked />} label='end' labelPlacement='end' />
          <FormControlLabel control={<Checkbox defaultChecked />} label='start' labelPlacement='start' />
          <FormControlLabel control={<Checkbox defaultChecked />} label='top' labelPlacement='top' />
          <FormControlLabel control={<Checkbox defaultChecked />} label='bottom' labelPlacement='bottom' />
          <FormControlLabel control={<Checkbox />} label='disabled' disabled />
        </Row>

        <SectionTitle>Icons · set (action color)</SectionTitle>
        <Row>
          <MenuIcon color='action' />
          <SearchIcon color='action' />
          <CloseIcon color='action' />
          <AddIcon color='action' />
          <DeleteIcon color='action' />
          <SettingsIcon color='action' />
          <ExpandMoreIcon color='action' />
          <ArrowBackIcon color='action' />
          <FavoriteIcon color='action' />
          <StarIcon color='action' />
        </Row>

        <SectionTitle>Icons · color</SectionTitle>
        <Row>
          <CheckCircleIcon color='success' />
          <WarningIcon color='warning' />
          <CloseIcon color='error' />
          <FavoriteIcon color='secondary' />
          <StarIcon color='primary' />
          <SettingsIcon htmlColor='#673ab7' />
        </Row>

        <SectionTitle>Icons · fontSize (small / medium / large)</SectionTitle>
        <Row>
          <StarIcon color='primary' fontSize='small' />
          <StarIcon color='primary' fontSize='medium' />
          <StarIcon color='primary' fontSize='large' />
          <SvgIcon pathData={iconPaths.Home} color='primary' size={48} />
        </Row>

        <SectionTitle>IconButton · colors + sizes</SectionTitle>
        <Row>
          <IconButton><DeleteIcon /></IconButton>
          <IconButton color='primary'><DeleteIcon /></IconButton>
          <IconButton color='secondary'><FavoriteIcon /></IconButton>
          <IconButton color='error'><FavoriteIcon /></IconButton>
          <IconButton color='success'><SettingsIcon /></IconButton>
          <IconButton disabled><DeleteIcon /></IconButton>
        </Row>
        <Row>
          <IconButton size='small' color='primary'><MenuIcon /></IconButton>
          <IconButton size='medium' color='primary'><MenuIcon /></IconButton>
          <IconButton size='large' color='primary'><MenuIcon /></IconButton>
          <IconButton onClick={() => { setCount((c) => c + 1) }}><CloseIcon /></IconButton>
        </Row>

        <SectionTitle>Tabs · standard</SectionTitle>
        <Paper variant='outlined'>
          <Tabs value={tabValue} onChange={(v) => { setTabValue(v as number) }}>
            <Tab label='Item One' value={0} />
            <Tab label='Item Two' value={1} />
            <Tab label='Item Three' value={2} />
          </Tabs>
        </Paper>

        <SectionTitle>Tabs · fullWidth + secondary</SectionTitle>
        <Paper variant='outlined'>
          <Tabs value={tabValue} onChange={(v) => { setTabValue(v as number) }} variant='fullWidth' textColor='secondary'>
            <Tab label='Full A' value={0} />
            <Tab label='Full B' value={1} />
            <Tab label='Full C' value={2} />
          </Tabs>
        </Paper>

        <SectionTitle>Tabs · disabled tab</SectionTitle>
        <Paper variant='outlined'>
          <Tabs value={0}>
            <Tab label='Active' value={0} />
            <Tab label='Disabled' value={1} disabled />
            <Tab label='Other' value={2} />
          </Tabs>
        </Paper>

        <SectionTitle>Breadcrumbs</SectionTitle>
        <Breadcrumbs>
          <Link underline='always' color='primary'>Home</Link>
          <Link underline='always' color='primary'>Category</Link>
          <Typography variant='body2' sx={{ color: 'text.primary' }}>Current Page</Typography>
        </Breadcrumbs>

        <SectionTitle>Breadcrumbs · custom separator</SectionTitle>
        <Breadcrumbs separator='›'>
          <Link underline='always' color='primary'>MUI</Link>
          <Link underline='always' color='primary'>Core</Link>
          <Typography variant='body2' sx={{ color: 'text.primary' }}>Breadcrumbs</Typography>
        </Breadcrumbs>

        <SectionTitle>Alert · standard</SectionTitle>
        <Stack spacing={1}>
          <Alert severity='success'>This is a success alert — check it out!</Alert>
          <Alert severity='info'>This is an info alert — check it out!</Alert>
          <Alert severity='warning'>This is a warning alert — check it out!</Alert>
          <Alert severity='error'>This is an error alert — check it out!</Alert>
        </Stack>

        <SectionTitle>Alert · outlined</SectionTitle>
        <Stack spacing={1}>
          <Alert variant='outlined' severity='success'>This is a success alert — check it out!</Alert>
          <Alert variant='outlined' severity='info'>This is an info alert — check it out!</Alert>
          <Alert variant='outlined' severity='warning'>This is a warning alert — check it out!</Alert>
          <Alert variant='outlined' severity='error'>This is an error alert — check it out!</Alert>
        </Stack>

        <SectionTitle>Alert · filled</SectionTitle>
        <Stack spacing={1}>
          <Alert variant='filled' severity='success'>This is a success alert — check it out!</Alert>
          <Alert variant='filled' severity='info'>This is an info alert — check it out!</Alert>
          <Alert variant='filled' severity='warning'>This is a warning alert — check it out!</Alert>
          <Alert variant='filled' severity='error'>This is an error alert — check it out!</Alert>
        </Stack>

        <SectionTitle>Alert · onClose / title / action</SectionTitle>
        <Stack spacing={1}>
          <Alert severity='info' onClose={() => { setCount((c) => c + 1) }}>
            This alert has a close button.
          </Alert>
          <Alert severity='warning'>
            <AlertTitle>Warning</AlertTitle>
            This is a warning alert with a title and body text.
          </Alert>
          <Alert severity='error' action={<Button color='error' size='small'>UNDO</Button>}>
            This alert has a custom action.
          </Alert>
        </Stack>

        <SectionTitle>Avatar · variants</SectionTitle>
        <Row>
          <Avatar>K</Avatar>
          <Avatar src='https://mui.com/static/images/avatar/1.jpg' />
          <Avatar />
          <Avatar variant='rounded'>R</Avatar>
          <Avatar variant='square'>S</Avatar>
        </Row>

        <SectionTitle>AvatarGroup · max=4</SectionTitle>
        <Row>
          <AvatarGroup max={4}>
            <Avatar>A</Avatar>
            <Avatar>B</Avatar>
            <Avatar>C</Avatar>
            <Avatar>D</Avatar>
            <Avatar>E</Avatar>
            <Avatar>F</Avatar>
          </AvatarGroup>
        </Row>

        <SectionTitle>CircularProgress</SectionTitle>
        <Row>
          <CircularProgress />
          <CircularProgress variant='determinate' value={75} />
          <CircularProgress color='secondary' />
          <CircularProgress size={24} />
        </Row>

        <SectionTitle>LinearProgress</SectionTitle>
        <Box sx={{ width: '100%', mb: 1 }}>
          <LinearProgress />
        </Box>
        <Box sx={{ width: '100%', mb: 1 }}>
          <LinearProgress variant='determinate' value={60} />
        </Box>
        <Box sx={{ width: '100%' }}>
          <LinearProgress color='secondary' />
        </Box>

        <SectionTitle>Dialog</SectionTitle>
        <Row>
          <Button variant='contained' onClick={() => { setDialogOpen(true) }}>Open dialog</Button>
        </Row>
        <Dialog open={dialogOpen} onClose={() => { setDialogOpen(false) }}>
          <DialogTitle>Use Google's location service?</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Let Google help apps determine location. This means sending anonymous location data to Google, even when no apps are running.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button variant='text' color='primary' onClick={() => { setDialogOpen(false) }}>Disagree</Button>
            <Button variant='text' color='primary' onClick={() => { setDialogOpen(false) }}>Agree</Button>
          </DialogActions>
        </Dialog>

        <SectionTitle>Tooltip · tap to toggle</SectionTitle>
        <Row>
          <Tooltip title='Delete'>
            <IconButton><DeleteIcon /></IconButton>
          </Tooltip>
          <Tooltip title='Add' placement='top'>
            <Button variant='outlined'>Top</Button>
          </Tooltip>
          <Tooltip title='Right side' placement='right'>
            <Button variant='outlined'>Right</Button>
          </Tooltip>
        </Row>

        <SectionTitle>Rating · press to select</SectionTitle>
        <Row>
          <Rating defaultValue={3} />
          <Rating defaultValue={2} size='small' />
          <Rating defaultValue={4} size='large' />
        </Row>

        <SectionTitle>Rating · read only + fractional + disabled</SectionTitle>
        <Row>
          <Rating value={3.5} readOnly />
          <Rating value={4} readOnly max={6} />
          <Rating value={2} disabled />
        </Row>

        <SectionTitle>Skeleton · variants</SectionTitle>
        <Box sx={{ width: '100%', mb: 1 }}>
          <Skeleton variant='text' />
        </Box>
        <Row>
          <Skeleton variant='circular' width={40} height={40} />
          <Skeleton variant='rounded' width={120} height={40} />
          <Skeleton variant='rectangular' width={120} height={40} />
        </Row>

        <SectionTitle>Skeleton · wave + no animation</SectionTitle>
        <Box sx={{ width: '100%', mb: 1 }}>
          <Skeleton variant='rectangular' width='100%' height={48} animation='wave' />
        </Box>
        <Box sx={{ width: '100%' }}>
          <Skeleton variant='rectangular' width='100%' height={48} animation={false} />
        </Box>

        <SectionTitle>Accordion</SectionTitle>
        <Accordion>
          <AccordionSummary>Accordion 1 (uncontrolled)</AccordionSummary>
          <AccordionDetails>
            <Typography variant='body2'>
              Content for the first accordion panel.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary>Accordion 2</AccordionSummary>
          <AccordionDetails>
            <Typography variant='body2'>
              Content for the second accordion panel.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion disabled>
          <AccordionSummary>Accordion 3 (disabled)</AccordionSummary>
          <AccordionDetails>
            <Typography variant='body2'>This is disabled.</Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={accordionExpanded}
          onChange={(exp) => setAccordionExpanded(exp)}
        >
          <AccordionSummary>Controlled Accordion</AccordionSummary>
          <AccordionDetails>
            <Typography variant='body2'>
              This accordion is controlled via state.
            </Typography>
          </AccordionDetails>
          <AccordionActions>
            <Button onClick={() => setAccordionExpanded(false)}>Cancel</Button>
            <Button onClick={() => setAccordionExpanded(false)}>OK</Button>
          </AccordionActions>
        </Accordion>

        <BatchJSection />
        <BatchLSection />
        <BatchOSection />
        <StepperSection />
      </Box>
    </scroll-view>
  )
}

// Batch J gallery — Fab, ButtonGroup, ToggleButtonGroup (self-contained state).
function BatchJSection() {
  const [alignment, setAlignment] = useState<string | null>('left')
  const [formats, setFormats] = useState<string[]>(['bold'])
  return (
    <>
      <SectionTitle>Fab · colors</SectionTitle>
      <Row>
        <Fab color='primary'><AddIcon /></Fab>
        <Fab color='secondary'><FavoriteIcon /></Fab>
        <Fab color='default'><SettingsIcon /></Fab>
        <Fab color='error'><DeleteIcon /></Fab>
        <Fab disabled><AddIcon /></Fab>
      </Row>

      <SectionTitle>Fab · sizes & extended</SectionTitle>
      <Row>
        <Fab size='small' color='primary'><AddIcon /></Fab>
        <Fab size='medium' color='primary'><AddIcon /></Fab>
        <Fab size='large' color='primary'><AddIcon /></Fab>
        <Fab variant='extended' color='primary'><ArrowBackIcon />navigate</Fab>
      </Row>

      <SectionTitle>ButtonGroup · variants</SectionTitle>
      <Row>
        <ButtonGroup variant='outlined'>
          <Button>One</Button>
          <Button>Two</Button>
          <Button>Three</Button>
        </ButtonGroup>
      </Row>
      <Row>
        <ButtonGroup variant='contained' color='secondary'>
          <Button>One</Button>
          <Button>Two</Button>
          <Button>Three</Button>
        </ButtonGroup>
      </Row>
      <Row>
        <ButtonGroup variant='text' color='primary'>
          <Button>One</Button>
          <Button>Two</Button>
          <Button>Three</Button>
        </ButtonGroup>
      </Row>

      <SectionTitle>ButtonGroup · vertical</SectionTitle>
      <Row>
        <ButtonGroup orientation='vertical' variant='outlined'>
          <Button>Top</Button>
          <Button>Middle</Button>
          <Button>Bottom</Button>
        </ButtonGroup>
      </Row>

      <SectionTitle>ToggleButtonGroup · exclusive</SectionTitle>
      <Row>
        <ToggleButtonGroup
          exclusive
          value={alignment}
          onChange={(v) => { setAlignment(v as string | null) }}
        >
          <ToggleButton value='left'>Left</ToggleButton>
          <ToggleButton value='center'>Center</ToggleButton>
          <ToggleButton value='right'>Right</ToggleButton>
        </ToggleButtonGroup>
      </Row>

      <SectionTitle>ToggleButtonGroup · multiple</SectionTitle>
      <Row>
        <ToggleButtonGroup
          color='primary'
          value={formats}
          onChange={(v) => { setFormats(v as string[]) }}
        >
          <ToggleButton value='bold'>Bold</ToggleButton>
          <ToggleButton value='italic'>Italic</ToggleButton>
          <ToggleButton value='underline'>Underline</ToggleButton>
        </ToggleButtonGroup>
      </Row>
    </>
  )
}

// Batch L gallery — Table family (self-contained state).
function BatchLSection() {
  const [order, setOrder] = useState<'asc' | 'desc'>('asc')
  const [orderBy, setOrderBy] = useState('calories')
  const [selected, setSelected] = useState('Eclair')

  const handleSort = (col: string) => {
    if (orderBy === col) {
      setOrder(order === 'asc' ? 'desc' : 'asc')
    } else {
      setOrderBy(col)
      setOrder('asc')
    }
  }

  return (
    <>
      <SectionTitle>Table · basic (right-aligned numerics)</SectionTitle>
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Dessert (100g serving)</TableCell>
                <TableCell align='right'>Calories</TableCell>
                <TableCell align='right'>Fat&nbsp;(g)</TableCell>
                <TableCell align='right'>Carbs&nbsp;(g)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow hover>
                <TableCell>Frozen yoghurt</TableCell>
                <TableCell align='right'>159</TableCell>
                <TableCell align='right'>6.0</TableCell>
                <TableCell align='right'>24</TableCell>
              </TableRow>
              <TableRow hover>
                <TableCell>Ice cream sandwich</TableCell>
                <TableCell align='right'>237</TableCell>
                <TableCell align='right'>9.0</TableCell>
                <TableCell align='right'>37</TableCell>
              </TableRow>
              <TableRow hover>
                <TableCell>Eclair</TableCell>
                <TableCell align='right'>262</TableCell>
                <TableCell align='right'>16.0</TableCell>
                <TableCell align='right'>24</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <SectionTitle>Table · dense (size=small) + selectable rows</SectionTitle>
      <Paper>
        <TableContainer>
          <Table size='small'>
            <TableHead>
              <TableRow>
                <TableCell>Dessert</TableCell>
                <TableCell align='right'>Calories</TableCell>
                <TableCell align='right'>Carbs</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow hover selected={selected === 'Frozen yoghurt'} onClick={() => setSelected('Frozen yoghurt')}>
                <TableCell>Frozen yoghurt</TableCell>
                <TableCell align='right'>159</TableCell>
                <TableCell align='right'>24</TableCell>
              </TableRow>
              <TableRow hover selected={selected === 'Eclair'} onClick={() => setSelected('Eclair')}>
                <TableCell>Eclair</TableCell>
                <TableCell align='right'>262</TableCell>
                <TableCell align='right'>24</TableCell>
              </TableRow>
              <TableRow hover selected={selected === 'Cupcake'} onClick={() => setSelected('Cupcake')}>
                <TableCell>Cupcake</TableCell>
                <TableCell align='right'>305</TableCell>
                <TableCell align='right'>67</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <SectionTitle>Table · checkbox padding + selection</SectionTitle>
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding='checkbox'>
                  <Checkbox />
                </TableCell>
                <TableCell>Dessert</TableCell>
                <TableCell align='right'>Calories</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow hover selected={selected === 'Frozen yoghurt'}>
                <TableCell padding='checkbox'>
                  <Checkbox
                    checked={selected === 'Frozen yoghurt'}
                    onChange={() => setSelected('Frozen yoghurt')}
                  />
                </TableCell>
                <TableCell>Frozen yoghurt</TableCell>
                <TableCell align='right'>159</TableCell>
              </TableRow>
              <TableRow hover selected={selected === 'Eclair'}>
                <TableCell padding='checkbox'>
                  <Checkbox checked={selected === 'Eclair'} onChange={() => setSelected('Eclair')} />
                </TableCell>
                <TableCell>Eclair</TableCell>
                <TableCell align='right'>262</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <SectionTitle>TableSortLabel · sortable header</SectionTitle>
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sortDirection={orderBy === 'name' ? order : false}>
                  <TableSortLabel
                    active={orderBy === 'name'}
                    direction={orderBy === 'name' ? order : 'asc'}
                    onClick={() => handleSort('name')}
                  >
                    Dessert
                  </TableSortLabel>
                </TableCell>
                <TableCell align='right' sortDirection={orderBy === 'calories' ? order : false}>
                  <TableSortLabel
                    active={orderBy === 'calories'}
                    direction={orderBy === 'calories' ? order : 'asc'}
                    onClick={() => handleSort('calories')}
                  >
                    Calories
                  </TableSortLabel>
                </TableCell>
                <TableCell align='right'>
                  <TableSortLabel hideSortIcon onClick={() => handleSort('fat')}>
                    Fat
                  </TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Frozen yoghurt</TableCell>
                <TableCell align='right'>159</TableCell>
                <TableCell align='right'>6.0</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Eclair</TableCell>
                <TableCell align='right'>262</TableCell>
                <TableCell align='right'>16.0</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <SectionTitle>Table · TableFooter</SectionTitle>
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Dessert</TableCell>
                <TableCell align='right'>Calories</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Frozen yoghurt</TableCell>
                <TableCell align='right'>159</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Ice cream sandwich</TableCell>
                <TableCell align='right'>237</TableCell>
              </TableRow>
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell>Total</TableCell>
                <TableCell align='right'>396</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </Paper>
    </>
  )
}

// Batch O gallery — Pagination & BottomNavigation (self-contained state).
function BatchOSection() {
  const [page, setPage] = useState(1)
  const [navValue, setNavValue] = useState(0)
  return (
    <>
      <SectionTitle>Pagination · variants</SectionTitle>
      <Row>
        <Pagination count={10} defaultPage={3} />
      </Row>
      <Row>
        <Pagination count={10} defaultPage={3} variant='outlined' />
      </Row>
      <Row>
        <Pagination count={10} defaultPage={3} shape='rounded' />
      </Row>

      <SectionTitle>Pagination · colors</SectionTitle>
      <Row>
        <Pagination count={10} defaultPage={3} color='primary' />
      </Row>
      <Row>
        <Pagination count={10} defaultPage={3} color='secondary' variant='outlined' />
      </Row>

      <SectionTitle>Pagination · sizes</SectionTitle>
      <Row>
        <Pagination count={6} defaultPage={3} size='small' />
      </Row>
      <Row>
        <Pagination count={6} defaultPage={3} size='large' />
      </Row>

      <SectionTitle>Pagination · first/last & disabled</SectionTitle>
      <Row>
        <Pagination count={11} defaultPage={6} showFirstButton showLastButton />
      </Row>
      <Row>
        <Pagination count={10} defaultPage={3} disabled />
      </Row>

      <SectionTitle>Pagination · controlled</SectionTitle>
      <Row>
        <Pagination
          count={10}
          page={page}
          color='primary'
          onChange={(value) => { setPage(value) }}
        />
      </Row>
      <Row>
        <Typography variant='body2'>Current page: {`${page}`}</Typography>
      </Row>

      <SectionTitle>BottomNavigation · showLabels</SectionTitle>
      <BottomNavigation
        showLabels
        value={navValue}
        onChange={(value) => { setNavValue(value as number) }}
      >
        <BottomNavigationAction label='Home' icon={<HomeIcon />} />
        <BottomNavigationAction label='Favorites' icon={<FavoriteIcon />} />
        <BottomNavigationAction label='Search' icon={<SearchIcon />} />
        <BottomNavigationAction label='Profile' icon={<PersonIcon />} />
      </BottomNavigation>

      <SectionTitle>BottomNavigation · selected-only label</SectionTitle>
      <BottomNavigation
        value={navValue}
        onChange={(value) => { setNavValue(value as number) }}
      >
        <BottomNavigationAction label='Home' icon={<HomeIcon />} />
        <BottomNavigationAction label='Favorites' icon={<FavoriteIcon />} />
        <BottomNavigationAction label='Search' icon={<SearchIcon />} />
        <BottomNavigationAction label='Profile' icon={<PersonIcon />} />
      </BottomNavigation>
    </>
  )
}

// Batch N gallery — Stepper family (self-contained state).
function StepperSection() {
  const steps = ['Select campaign', 'Create ad group', 'Create ad']
  const [activeStep, setActiveStep] = useState(0)
  const [mobileStep, setMobileStep] = useState(0)
  const maxSteps = 5
  const handleNext = () => { setActiveStep((s) => Math.min(s + 1, steps.length)) }
  const handleBack = () => { setActiveStep((s) => Math.max(s - 1, 0)) }
  const handleReset = () => { setActiveStep(0) }

  return (
    <>
      <SectionTitle>Stepper · horizontal linear</SectionTitle>
      <Stepper activeStep={activeStep} sx={{ mb: 1 }}>
        {steps.map((label) => (
          <Step key={label}><StepLabel>{label}</StepLabel></Step>
        ))}
      </Stepper>
      <Row>
        <Button variant='outlined' disabled={activeStep === 0} onClick={handleBack}>Back</Button>
        <Button variant='contained' onClick={handleNext}>
          {activeStep >= steps.length - 1 ? 'Finish' : 'Next'}
        </Button>
        <Button variant='text' onClick={handleReset}>Reset</Button>
      </Row>

      <SectionTitle>Stepper · alternativeLabel</SectionTitle>
      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 1 }}>
        {steps.map((label) => (
          <Step key={label}><StepLabel>{label}</StepLabel></Step>
        ))}
      </Stepper>

      <SectionTitle>Stepper · states (completed / active / error / disabled)</SectionTitle>
      <Stepper activeStep={1}>
        <Step completed><StepLabel>Completed</StepLabel></Step>
        <Step><StepLabel>Active</StepLabel></Step>
        <Step><StepLabel error>Error</StepLabel></Step>
        <Step><StepLabel>Disabled</StepLabel></Step>
      </Stepper>

      <SectionTitle>Stepper · non-linear (StepButton)</SectionTitle>
      <Stepper nonLinear activeStep={activeStep}>
        {steps.map((label, index) => (
          <Step key={label}>
            <StepButton onClick={() => { setActiveStep(index) }}>{label}</StepButton>
          </Step>
        ))}
      </Stepper>

      <SectionTitle>Stepper · vertical + StepContent</SectionTitle>
      <Stepper activeStep={activeStep} orientation='vertical'>
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
            <StepContent>
              <Typography variant='body2' sx={{ color: 'text.secondary', mb: 1 }}>
                Content for “{label}”.
              </Typography>
              <Row>
                <Button variant='contained' size='small' onClick={handleNext}>
                  {index === steps.length - 1 ? 'Finish' : 'Continue'}
                </Button>
                <Button variant='text' size='small' disabled={index === 0} onClick={handleBack}>Back</Button>
              </Row>
            </StepContent>
          </Step>
        ))}
      </Stepper>

      <SectionTitle>MobileStepper · dots / progress / text</SectionTitle>
      <MobileStepper
        variant='dots'
        steps={maxSteps}
        position='static'
        activeStep={mobileStep}
        backButton={
          <Button variant='text' size='small' disabled={mobileStep === 0} onClick={() => { setMobileStep((s) => s - 1) }}>Back</Button>
        }
        nextButton={
          <Button variant='text' size='small' disabled={mobileStep === maxSteps - 1} onClick={() => { setMobileStep((s) => s + 1) }}>Next</Button>
        }
      />
      <MobileStepper
        variant='progress'
        steps={maxSteps}
        position='static'
        activeStep={mobileStep}
        backButton={
          <Button variant='text' size='small' disabled={mobileStep === 0} onClick={() => { setMobileStep((s) => s - 1) }}>Back</Button>
        }
        nextButton={
          <Button variant='text' size='small' disabled={mobileStep === maxSteps - 1} onClick={() => { setMobileStep((s) => s + 1) }}>Next</Button>
        }
      />
      <MobileStepper
        variant='text'
        steps={maxSteps}
        position='static'
        activeStep={mobileStep}
        backButton={
          <Button variant='text' size='small' disabled={mobileStep === 0} onClick={() => { setMobileStep((s) => s - 1) }}>Back</Button>
        }
        nextButton={
          <Button variant='text' size='small' disabled={mobileStep === maxSteps - 1} onClick={() => { setMobileStep((s) => s + 1) }}>Next</Button>
        }
      />
    </>
  )
}
