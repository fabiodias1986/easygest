import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const properties = await prisma.property.findMany()
    return NextResponse.json(properties)
  } catch (error) {
    return NextResponse.json({ error: 'Erro' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const property = await prisma.property.create({
      data: {
        cmi: body.cmi,
        al: body.al,
        location: body.location,
      },
    })
    return NextResponse.json(property)
  } catch (error) {
    alert('Erro a Criar:')
    return NextResponse.json({ error: 'Erro ao criar' }, { status: 500 })
  }
}