import { useState } from '@lynx-js/react'
import type { ReactNode } from '@lynx-js/react'

import './App.css'
import {
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Stack,
  Typography,
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
      </Box>
    </scroll-view>
  )
}
