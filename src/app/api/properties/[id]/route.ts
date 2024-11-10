import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const property = await prisma.property.update({
      where: { id: params.id },
      data: {
        cmi: body.cmi,
        al: body.al,
        location: body.location,
      },
    })
    return NextResponse.json(property)
  } catch (error) {
    return NextResponse.json({ error: 'Error updating property' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.property.delete({
      where: { id: params.id },
    })
    return NextResponse.json({ message: 'Localização apagada' })
  } catch (error) {
    return NextResponse.json({ error: 'Erro a apagar' }, { status: 500 })
  }
}