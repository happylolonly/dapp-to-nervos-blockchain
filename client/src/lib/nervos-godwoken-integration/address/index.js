"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddressTranslator = void 0;
var pw_core_1 = __importStar(require("@lay2/pw-core"));
var base_1 = require("@ckb-lumos/base");
var config_json_1 = __importDefault(require("../config/config.json"));
var helpers_1 = require("./helpers");
var helpers_2 = require("@ckb-lumos/helpers");
var AddressTranslator = /** @class */ (function () {
    function AddressTranslator(config) {
        if (config) {
            this._config = config;
        }
        else {
            this._config = {
                CKB_URL: config_json_1.default.ckb_url,
                INDEXER_URL: config_json_1.default.indexer_url,
                deposit_lock_script_type_hash: config_json_1.default.deposit_lock.script_type_hash,
                eth_account_lock_script_type_hash: config_json_1.default.eth_account_lock.script_type_hash,
                rollup_type_script: config_json_1.default.chain.rollup_type_script,
                rollup_type_hash: config_json_1.default.rollup_script_hash,
                portal_wallet_lock_hash: config_json_1.default.portal_wallet_lock_hash,
            };
        }
        this._deploymentConfig = helpers_1.generateDeployConfig(this._config.deposit_lock_script_type_hash, this._config.eth_account_lock_script_type_hash);
    }
    AddressTranslator.prototype.getDepositionLockArgs = function (ownerLockHash, layer2_lock_args, cancelTimeout) {
        if (cancelTimeout === void 0) { cancelTimeout = "0xc00000000002a300"; }
        var rollup_type_hash = helpers_1.getRollupTypeHash(this._config.rollup_type_script);
        var depositionLockArgs = {
            owner_lock_hash: ownerLockHash,
            layer2_lock: {
                code_hash: this._deploymentConfig.eth_account_lock.code_hash,
                hash_type: this._deploymentConfig.eth_account_lock.hash_type,
                args: rollup_type_hash + layer2_lock_args.slice(2),
            },
            cancel_timeout: cancelTimeout, // relative timestamp, 2 days
        };
        return depositionLockArgs;
    };
    AddressTranslator.prototype.getLayer2DepositAddress = function (web3, ethAddr) {
        return __awaiter(this, void 0, void 0, function () {
            var provider, collector, pwAddr, ownerLockHash, depositionLockArgs, serializedArgs, depositionLock, script, depositAddr;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.checkDefaultWeb3AccountPresent(web3)];
                    case 1:
                        if (_a.sent()) {
                            provider = new pw_core_1.Web3ModalProvider(web3);
                        }
                        else {
                            provider = new pw_core_1.RawProvider('0x23211b1f333aece687eebc5b90be6b55962f5bf0433edd23e1c73d93a67f70e5');
                        }
                        collector = new pw_core_1.IndexerCollector(this._config.INDEXER_URL);
                        return [4 /*yield*/, new pw_core_1.default(this._config.CKB_URL).init(provider, collector)];
                    case 2:
                        _a.sent();
                        pwAddr = new pw_core_1.Address(ethAddr, pw_core_1.AddressType.eth);
                        ownerLockHash = pwAddr.toLockScript().toHash();
                        depositionLockArgs = this.getDepositionLockArgs(ownerLockHash, pwAddr.lockArgs);
                        serializedArgs = helpers_1.serializeArgs(depositionLockArgs, this._config.rollup_type_script);
                        depositionLock = helpers_1.generateDepositionLock(this._deploymentConfig, serializedArgs);
                        script = pw_core_1.Script.fromRPC(depositionLock);
                        depositAddr = pw_core_1.Address.fromLockScript(script);
                        return [2 /*return*/, depositAddr];
                }
            });
        });
    };
    AddressTranslator.prototype.ethAddressToCkbAddress = function (ethAddress, isTestnet) {
        if (isTestnet === void 0) { isTestnet = false; }
        var script = {
            code_hash: this._config.portal_wallet_lock_hash,
            hash_type: "type",
            args: ethAddress,
        };
        var predefined = require("@ckb-lumos/config-manager").predefined;
        var address = helpers_2.generateAddress(script, isTestnet
            ? {
                config: predefined.AGGRON4,
            }
            : undefined);
        return address;
    };
    AddressTranslator.prototype.ethAddressToGodwokenShortAddress = function (ethAddress) {
        if (ethAddress.length !== 42 || !ethAddress.startsWith("0x")) {
            throw new Error("eth address format error!");
        }
        var layer2Lock = {
            code_hash: this._config.eth_account_lock_script_type_hash,
            hash_type: "type",
            args: this._config.rollup_type_hash + ethAddress.slice(2).toLowerCase(),
        };
        var scriptHash = base_1.utils.computeScriptHash(layer2Lock);
        var shortAddress = scriptHash.slice(0, 42);
        return shortAddress;
    };
    AddressTranslator.prototype.checkDefaultWeb3AccountPresent = function (web3) {
        return __awaiter(this, void 0, void 0, function () {
            var accounts;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, web3.eth.getAccounts()];
                    case 1:
                        accounts = _a.sent();
                        return [2 /*return*/, Boolean(accounts === null || accounts === void 0 ? void 0 : accounts[0])];
                }
            });
        });
    };
    return AddressTranslator;
}());
exports.AddressTranslator = AddressTranslator;
