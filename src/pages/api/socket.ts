import { Server, Server as IOServer } from 'Socket.IO'
import { Balls, SocketEvents } from '../../utils/globalTypesEnumsAndInterfaces'

import type { Server as HTTPServer } from 'http'
import type { NextApiRequest, NextApiResponse } from 'next'
import type { Socket as NetSocket } from 'net'

interface SocketServer extends HTTPServer {
  io?: IOServer | undefined
}

interface SocketWithIO extends NetSocket {
  server: SocketServer
}

interface NextApiResponseWithSocket extends NextApiResponse {
  socket: SocketWithIO
}

const SocketHandler = (req: NextApiRequest, res: NextApiResponseWithSocket) => {

  if (res.socket?.server.io) {
    console.log('Socket is already running')
  } else {

    console.log('Socket is initializing')
    const io = new Server(res.socket.server)
    res.socket.server.io = io

    io.on(SocketEvents.CONNECTION, (socket) => {

      socket.on(SocketEvents.HANDLER_ADD_BALL, async (ball: Balls) => {
        const body = {
          newBall: ball,
          message: SocketEvents.HANDLER_ADD_BALL
        }

        const newGameSituation = await fetch('http://localhost:3000/api/score-manager', {
          method: 'POST',
          body: JSON.stringify(body)
        })

        const newGameSituationJson = await newGameSituation.json()
        io.emit(SocketEvents.ADD_BALL, newGameSituationJson);
      });

      socket.on(SocketEvents.HANDLER_CLEAR_SHOE, async () => {
        const body = {
          message: SocketEvents.HANDLER_CLEAR_SHOE
        }

        const newGameSituation = await fetch('http://localhost:3000/api/score-manager', {
          method: 'POST',
          body: JSON.stringify(body)
        })

        const newGameSituationJson = await newGameSituation.json()
        io.emit(SocketEvents.CLEAR_SHOE, newGameSituationJson);
      });

      socket.on(SocketEvents.DISCONNECT, () => {
        console.log(`socket ${socket.id} disconnected`)
      })

    })

  }

  res.end()
}

export default SocketHandler