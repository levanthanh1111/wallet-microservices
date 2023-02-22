require('./services/log/Log4js');
import app from "./App";
import Logger from "./exceptions/Logger";

const PORT = process.env.PORT || 4003;

app.listen(PORT, () => {
    Logger.success(`Server is running on: http://localhost:${PORT}`);
});

process.on("uncaughtException", (_error: any, source: any) => {
    console.log(source);
});




