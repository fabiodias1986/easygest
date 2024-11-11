import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface Params {
  id: string;
}

// Function to handle PUT requests
export async function PUT(request: NextRequest, { params }: { params: Params }) {
  const { id } = params;

  try {
    const body = await request.json();

    // Check if required fields are present
    if (!body.cmi || !body.al || !body.location) {
      return NextResponse.json({ error: 'Campos cmi, al e location são obrigatórios' }, { status: 400 });
    }

    const property = await prisma.property.update({
      where: { id },
      data: {
        cmi: body.cmi,
        al: body.al,
        location: body.location,
      },
    });

    return NextResponse.json(property);
  } catch {
    return NextResponse.json({ error: 'Erro ao atualizar a propriedade' }, { status: 500 });
  }
}

// Function to handle DELETE requests
export async function DELETE(request: NextRequest, { params }: { params: Params }) {
  const { id } = params;

  try {
    await prisma.property.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Localização apagada' });
  } catch {
    return NextResponse.json({ error: 'Erro ao apagar' }, { status: 500 });
  }
}