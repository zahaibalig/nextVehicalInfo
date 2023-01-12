// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string,
  number: any
}


const fetchresults = async (number:any) => {
  try {
    const res = await axios.get(
      `https://www.vegvesen.no/ws/no/vegvesen/kjoretoy/felles/datautlevering/enkeltoppslag/kjoretoydata?kjennemerke=${number}`,
      {
        headers: {
          "SVV-Authorization": "Apikey fea6488c-bf34-4326-8b83-d1cb5e25d810",
        },
      }
    );
    return res.data;
  } catch (err) {
    console.log("error retriving the data");
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const regNumber= req.query.number;
  let data = await fetchresults(regNumber);

  if(!data) return 
  

  let {
    kjoretoyId,
    registrering: {
      kjoringensArt: { kodeBeskrivelse },
    },
    godkjenning:{tekniskGodkjenning:{tekniskeData:{generelt:{merke}}}},
    godkjenning:{tekniskGodkjenning:{tekniskeData:{generelt:{fabrikant:{fabrikantNavn}}}}},
    godkjenning:{tekniskGodkjenning:{tekniskeData:{generelt:{handelsbetegnelse}}}},
    forstegangsregistrering:{registrertForstegangNorgeDato},
    periodiskKjoretoyKontroll:{kontrollfrist,sistGodkjent}
  } = data.kjoretoydataListe[0];
 
  const filteredData = {
    kjoretoyId,
    kodeBeskrivelse,
    fabrikantNavn,    
    merke,
    handelsbetegnelse,
    kontrollfrist,
    sistGodkjent,
    registrertForstegangNorgeDato,
  };


  res.status(200).json(filteredData)
}