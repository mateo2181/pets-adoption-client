import { getToken } from 'next-auth/jwt';
import type { NextApiRequest, NextApiResponse } from 'next';
import client from 'apollo/client';
import { CREATE_PET } from 'apollo/queries';

const secret = process.env.SECRET;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = await getToken({ req, secret });
  // console.log(token);
  const { data } = await client.mutate({
    mutation: CREATE_PET,
    variables: {
      name: 'Boby 2',
      high: '140 cm',
      petTypeId: 1,
      petBreedId: 4
    }
  });
  res.send({ data });
};