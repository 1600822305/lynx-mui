import { useState } from '@lynx-js/react'
import type { ReactNode } from '@lynx-js/react'

import './App.css'
import {
  AddIcon,
  AppBar,
  ArrowBackIcon,
  Badge,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CheckCircleIcon,
  Chip,
  CloseIcon,
  Container,
  DeleteIcon,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  ExpandMoreIcon,
  FavoriteIcon,
  iconPaths,
  Link,
  List,
  ListItem,
  ListItemText,
  MenuIcon,
  Paper,
  SearchIcon,
  SettingsIcon,
  Stack,
  StarIcon,
  SvgIcon,
  ToggleButton,
  Toolbar,
  Typography,
  WarningIcon,
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
      </Box>
    </scroll-view>
  )
}
