import { createClient, Session } from '@supabase/supabase-js'

import './App.css'
import Game from "./paginas/GameScreen/Game"
import Login from "./paginas//LoginScreen/LoginScreen"

import { BrowserRouter, Route, Routes } from 'react-router'
import { useEffect, useState } from 'react'
import { getDataFromUser, insereGun, updateGun, updateProfile } from './componentes/Api/config'
import LoreContainer from './componentes/LoreContainer/LoreContainer'
import UpgradeContainer from './componentes/UpgradeContainer/UpgradeContainer'

const supabaseUrl = 'https://hcsmsnyvmcgkgvnppedi.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhjc21zbnl2bWNna2d2bnBwZWRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc3NzAxMjksImV4cCI6MjA1MzM0NjEyOX0.hjWIEc7zSW5xL7X2tHydujCl55yDPWY6aT30hi-80NM'
const supabase = createClient(supabaseUrl, supabaseKey)
type Lore = {
    titulo:string,
    lore:string,
}
const Lores= new Map<number,Lore>([
    [0,{
        titulo:"Bubble Gun",
        lore:"A guerra entre as nações das Agulhas só se intensifica, e a situação fica cada vez mais crítica. Somos, uma corporação bélica, que se limita a vender arcos de bolha, a única arma realmente agressiva do nosso povo.",
    }],
    [1,{
        titulo:"Arma Bolhuda",
        lore:"Com o avanço da guerra, nossos engenheiros desenvolveram as armas Bolhudas, uma metralhadora automática de bolhas de grande potência. Embora sua eficácia seja limitada, é o melhor que temos até agora. No entanto, seu alto custo a torna inacessível para a maioria dos batalhões.",

    }],
    [2,{
        titulo:"Bolhão Erlenmeyer",
        lore:"O cientista Bolhudo Erlenmeyer criou um poderoso agente corrosivo contra a Nação Agulha, cuja ação é letal. No entanto, ele é comercializado ilegalmente, pois foi banido pelas outras nações devido à sua natureza excessivamente agressiva.",
    }],
   
    [3,{
        titulo:"Bolha de aço",
        lore:"As bolhas de aço são imparáveis no front, verdadeiras máquinas de guerra. Elas destroem tudo em seu caminho com suas bolhas redondas e coloridas.",
    }],
    [4,{
        titulo:"Aquecedor de bolhas",
        lore:"O soldado Kalash Bolhovaldo criou uma poderosa arma de bolhas quentes, capaz de derreter as máquinas da Nação Agulha. Ela tem se tornado cada vez mais popular entre os movimentos rebeldes que lutam contra a Nação Agulha.",
    }],
    [5,{
        titulo:"Bolha atômica",
        lore:"Nossa nação criou a máquina mais mortífera de Bolhandia. Será que a Nação Agulha realmente merecia esse fim?",
    }]
])

type Arma = {
    nome:string,
    codigo_imagem:string,
    valor_segundo:number,
    valor_click:number,
    block:boolean,
    valor_desbloqueio:number,
    valorUpgrade:number
    adquiridoUpgrade:boolean,
    id:number,
    tipoUpgrade:"Autoclicker"|"Multiplicador"|"Acelerador"|"Inexistente"
    
  }
function App() {
    const [session,setSession]= useState<Session>();
    const [armas,setArmas] = useState<Arma[]>([]);
    const [loreIndex,setLoreIndex] = useState(0);
    const [loreVisible,setLoreVisible] = useState(false);
    const [Detergentes, setDetergente] = useState(0)

    const [showUpgrades,setShowUpgrade]=useState(false)
    let ggg:Arma[] =[];
    
    useEffect(() => {
        if (session){
            attSession()
            attArmas()
            attProfile()
        };
    }, [session])
    async function attProfile(){
        const { data, error } = await supabase.from('user').select().eq('uuid', session?.user.id).single()

        if (error) {
          console.log(error);
        } else {
            console.log(data)
            setDetergente(data.detergente)
        }
    }
    async function attArmas(){
        const { data, error } = await supabase.from('gun').select().eq('autor', session?.user.id)

        if (error) {
          console.log(error);
        } else {
            const arrn = data.sort((a:any, b:any) => a.id - b.id).slice()
            setArmas(arrn)
            console.log(data)

            ggg = data
        }
    }
    async function attSession(){
        setSession(session)
    }
    async function salvar() {
        updateProfile({detergente:Detergentes,session:session!})
        console.log(armas)
        armas.forEach(async (arma:Arma)=>{
            // try {
            //     console.log(arma)
            //     await updateGun(
            //         {
            //             nome:arma.nome,
            //             block:arma.block
            //             session:
            //             valor_segundo:
            //             valor_click:
            //             codigo_imagem:
            //             valor_desbloqueio:
            //             id:
            //             tipoUpgrade:
            //             valorUpgrade:
            //             adquiridoUpgrade)
            // } catch (error) {
            //     console.log(error)
            // }
            
        })
    }
    return(
        <div>
            <BrowserRouter>
                    <Routes>
                        <Route path="/bubblegod/" element={<Login setSession={setSession} />} /> 
                        
                        <Route path="/bubblegod/game" element={<Game salvarjogo={salvar} armas={armas} setDetergente={setDetergente} detergente={Detergentes}setUpgradeVisible={setShowUpgrade}  showLore={()=>{
                            setLoreVisible(true)
                        }}  />} /> 

                        {/* <Route path="/bubblegod/powerup" element={<PowerUps powerups={elementos}  />} />  */}
                    </Routes>
            </BrowserRouter>
            <UpgradeContainer 
                armas={armas} 
                setArmas={setArmas} 
                visible={showUpgrades} 
                setDetergente={setDetergente}
                detergente={Detergentes}
                setVisible={setShowUpgrade}>
            </UpgradeContainer>
            <LoreContainer 
                titulo={Lores.get(loreIndex)?.titulo!}
                lore={Lores.get(loreIndex)?.lore!}
                visible={loreVisible}
                increaseIndex={()=>{
                    console.log("sss")
                    setLoreIndex(loreIndex+1)
                    setLoreVisible(false)
                }}
            ></LoreContainer>
        </div>
       
    )
   
}

export default App
