"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BridgeRPCHandler = void 0;
var ethers_1 = require("ethers");
var json_rpc_2_0_1 = require("json-rpc-2.0");
var BridgeRPCHandler = /** @class */ (function () {
    function BridgeRPCHandler(forceBridgeUrl) {
        var _this = this;
        this.client = new json_rpc_2_0_1.JSONRPCClient(function (jsonRPCRequest) {
            return fetch(forceBridgeUrl, {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify(jsonRPCRequest),
            }).then(function (response) {
                if (response.status === 200) {
                    // Use client.receive when you received a JSON-RPC response.
                    return response
                        .json()
                        .then(function (jsonRPCResponse) { return _this.client.receive(jsonRPCResponse); });
                }
                else if (jsonRPCRequest.id !== undefined) {
                    return Promise.reject(new Error(response.statusText));
                }
                else {
                    return Promise.reject(new Error("request id undefined"));
                }
            });
        });
    }
    BridgeRPCHandler.prototype.getBridgeInNervosBridgeFee = function (payload) {
        return Promise.resolve(this.client.request("getBridgeInNervosBridgeFee", payload));
    };
    BridgeRPCHandler.prototype.getBridgeOutNervosBridgeFee = function (payload) {
        return Promise.resolve(Promise.resolve(this.client.request("getBridgeOutNervosBridgeFee", payload)));
    };
    BridgeRPCHandler.prototype.generateBridgeInNervosTransaction = function (payload) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var result, rawTx;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.client.request("generateBridgeInNervosTransaction", payload)];
                    case 1:
                        result = _c.sent();
                        switch (result.network) {
                            case "Ethereum":
                                {
                                    rawTx = result.rawTransaction;
                                    rawTx.value = ethers_1.ethers.BigNumber.from((_b = (_a = rawTx.value) === null || _a === void 0 ? void 0 : _a.hex) !== null && _b !== void 0 ? _b : 0);
                                    result.rawTransaction = rawTx;
                                }
                                break;
                            default:
                                //TODO add other chains
                                Promise.reject(new Error("not yet"));
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    BridgeRPCHandler.prototype.generateBridgeOutNervosTransaction = function (payload) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.client.request("generateBridgeOutNervosTransaction", payload)];
            });
        });
    };
    BridgeRPCHandler.prototype.sendSignedTransaction = function (payload) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.client.request("sendSignedTransaction", payload)];
            });
        });
    };
    BridgeRPCHandler.prototype.getBridgeTransactionStatus = function (payload) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.client.request("getBridgeTransactionStatus", payload)];
            });
        });
    };
    BridgeRPCHandler.prototype.getBridgeTransactionSummaries = function (payload) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.request("getBridgeTransactionSummaries", payload)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    BridgeRPCHandler.prototype.getAssetList = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var param;
            return __generator(this, function (_a) {
                param = { asset: name };
                if (name == undefined) {
                    param = { asset: "all" };
                }
                return [2 /*return*/, this.client.request("getAssetList", param)];
            });
        });
    };
    BridgeRPCHandler.prototype.getBalance = function (payload) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.client.request("getBalance", payload)];
            });
        });
    };
    BridgeRPCHandler.prototype.getBridgeConfig = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.client.request("getBridgeConfig")];
            });
        });
    };
    return BridgeRPCHandler;
}());
exports.BridgeRPCHandler = BridgeRPCHandler;
