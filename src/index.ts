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
function getDeviceType() {
    const ua = navigator.userAgent
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
        return "tablet"
    }
    if (
        /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
            ua
        )
    ) {
        return "mobile"
    }
    return "desktop"
}

function init() {
    const event = ['mobile', 'tablet'].includes(getDeviceType()) ? 'touchend' : 'click'
    const checkEle = document.getElementById('check-now')
    
    checkEle?.addEventListener('click', () => {

        if (!window.connex) {
            location.href = 'https://env.vechain.org/r/#' + encodeURIComponent(location.href)
        }
        getTokenList().then(decoded => {
            const dialog = document.createElement('div')
            const alert = document.createElement('div')
            dialog.classList.add('dialog')

            if (decoded && decoded[0] && decoded[0].length) {
                const img = document.createElement('img')
                const span = document.createElement('span')
                span.innerText = 'Congratulations! You have won the VeChain Community Awards!'
                span.style.color = '#fff'
                span.style.fontSize = '1.4em'
                img.style.width = '100%'
                img.style.maxWidth = '600px'
                img.style.display = 'block'
                img.style.margin = '30px auto'
                img.src = 'https://cdn.vechain.com/wallet/images/community-award-tokens/token.png'
                alert.append(span)
                alert.append(img)
                alert.classList.add('alert-img')
            } else {
                const ldiv = document.createElement('div')
                const img = document.createElement('img')
                img.src = require('./assets/warning.png')
                img.style.width = '60px'

                const rdiv = document.createElement('div')
                const span = document.createElement('span')
                span.innerText = `Sorry! You don't own any community award NFTs yet!`

                ldiv.append(img)
                rdiv.append(span)
                alert.append(ldiv)
                alert.append(rdiv)
                alert.classList.add('tip-1', 'alert-text')
            }
            dialog.append(alert)
            dialog.addEventListener(event, function (event) {
                event.stopPropagation()
                if (event.target === dialog) {
                    dialog.remove()
                }
            })
            document.body.append(dialog)
        })
    })
}

window.onload = init