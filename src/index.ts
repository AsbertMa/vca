import './style/theme.css'
import { abi } from 'thor-devkit'

const TOKEN_ABI: abi.Function.Definition = {
    constant: true,
    inputs: [
        {
            name: "addr",
            type: "address"
        }
    ],
    name: "getTokenList",
    outputs: [
        {
            name: "",
            type: "uint256[]"
        }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
}

async function getAddress() {
    try {
        const cert = await connex.vendor.sign('cert').request({
            purpose: 'agreement',
            payload: {
                type: 'text',
                content: 'Approve VeChain community award smart contract to check NFT balance'
            }
        })
        return cert.annex.signer
    } catch (error) {
    }
}

async function getTokenList() {
    const params = await getAddress()
    const addr = '0xac33155a79Ee8A07695f5C639951cbBcAF07C014'
    const method = connex.thor.account(addr).method(TOKEN_ABI)
    if (params) {
        const r = await method.call(params)
        return r.decoded
    }
}

window.onload = function () {
    getTokenList().then(decoded => {
        if (decoded && decoded[0] && decoded[0].length) {
            const img = document.createElement('img')
            img.style.width = '100%'
            img.style.maxWidth = '600px'
            img.style.display = 'block'
            img.style.margin = '10px auto'
            img.src = 'https://cdn.vechain.com/wallet/images/community-award-tokens/token.png'

            document.body.append(img)
        } else {
            const c = document.querySelector('.content')
            if (c) {
                (c as (HTMLElement)).style.display = 'block'
            }
        }
    })
}