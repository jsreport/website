export default function (jsreportClient) {
    return async function (data) {
        const renderResult = await jsreportClient.render({
            template: {
                name: '/payments/invoice'
            },
            data
        })

        return renderResult.body()
    }
}