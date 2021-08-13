"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateDeployConfig =
  exports.SerializeDepositionLockArgs =
  exports.SerializeScript =
  exports.SerializeUint64 =
  exports.SerializeBytes =
  exports.SerializeByte32 =
  exports.serializeTable =
  exports.serializeArgs =
  exports.generateDepositionLock =
  exports.getRollupTypeHash =
    void 0;
var ckb_js_toolkit_1 = require("ckb-js-toolkit");
var base_1 = require("@ckb-lumos/base");
function getRollupTypeHash(rollup_type_script) {
  var hash = base_1.utils.computeScriptHash(rollup_type_script);
  return hash;
}
exports.getRollupTypeHash = getRollupTypeHash;
function generateDepositionLock(config, args) {
  return {
    code_hash: config.deposition_lock.code_hash,
    hash_type: config.deposition_lock.hash_type,
    args: args,
  };
}
exports.generateDepositionLock = generateDepositionLock;
function serializeArgs(args, rollup_type_script) {
  var rollup_type_hash = getRollupTypeHash(rollup_type_script);
  var serializedDepositionLockArgs = SerializeDepositionLockArgs(
    NormalizeDepositionLockArgs(args)
  );
  var depositionLockArgsStr = new ckb_js_toolkit_1.Reader(
    serializedDepositionLockArgs
  ).serializeJson();
  return rollup_type_hash + depositionLockArgsStr.slice(2);
}
exports.serializeArgs = serializeArgs;
function normalizeHexNumber(length) {
  return function (debugPath, value) {
    if (!(value instanceof ArrayBuffer)) {
      var intValue = value.toString(16);
      if (intValue.length % 2 !== 0) {
        intValue = "0" + intValue;
      }
      if (intValue.length / 2 > length) {
        throw new Error(
          debugPath +
            " is " +
            intValue.length / 2 +
            " bytes long, expected length is " +
            length +
            "!"
        );
      }
      var view = new DataView(new ArrayBuffer(length));
      for (var i = 0; i < intValue.length / 2; i++) {
        var start = intValue.length - (i + 1) * 2;
        view.setUint8(i, parseInt(intValue.substr(start, 2), 16));
      }
      value = view.buffer;
    }
    if (value.byteLength < length) {
      var array = new Uint8Array(length);
      array.set(new Uint8Array(value), 0);
      value = array.buffer;
    }
    return value;
  };
}
function normalizeObject(debugPath, obj, keys) {
  var result = {};
  for (var _i = 0, _a = Object.entries(keys); _i < _a.length; _i++) {
    var _b = _a[_i],
      key = _b[0],
      f = _b[1];
    var value = obj[key];
    if (!value) {
      throw new Error(debugPath + " is missing " + key + "!");
    }
    result[key] = f(debugPath + "." + key, value);
  }
  return result;
}
function normalizeRawData(length) {
  return function (debugPath, value) {
    value = new ckb_js_toolkit_1.Reader(value).toArrayBuffer();
    if (length > 0 && value.byteLength !== length) {
      throw new Error(
        debugPath +
          " has invalid length " +
          value.byteLength +
          ", required: " +
          length
      );
    }
    return value;
  };
}
function toNormalize(normalize) {
  return function (debugPath, value) {
    return normalize(value, {
      debugPath: debugPath,
    });
  };
}
function NormalizeDepositionLockArgs(args, _a) {
  var _b = _a === void 0 ? {} : _a,
    _c = _b.debugPath,
    debugPath = _c === void 0 ? "deposition_lock_args" : _c;
  return normalizeObject(debugPath, args, {
    owner_lock_hash: normalizeRawData(32),
    layer2_lock: toNormalize(ckb_js_toolkit_1.normalizers.NormalizeScript),
    cancel_timeout: normalizeHexNumber(8),
  });
}
function dataLengthError(actual, required) {
  throw new Error(
    "Invalid data length! Required: " + required + ", actual: " + actual
  );
}
function assertArrayBuffer(reader) {
  if (reader instanceof Object && reader.toArrayBuffer instanceof Function) {
    reader = reader.toArrayBuffer();
  }
  if (!(reader instanceof ArrayBuffer)) {
    throw new Error(
      "Provided value must be an ArrayBuffer or can be transformed into ArrayBuffer!"
    );
  }
  return reader;
}
function assertDataLength(actual, required) {
  if (actual !== required) {
    dataLengthError(actual, required);
  }
}
function serializeTable(buffers) {
  var itemCount = buffers.length;
  var totalSize = 4 * (itemCount + 1);
  var offsets = [];
  for (var i = 0; i < itemCount; i++) {
    offsets.push(totalSize);
    totalSize += buffers[i].byteLength;
  }
  var buffer = new ArrayBuffer(totalSize);
  var array = new Uint8Array(buffer);
  var view = new DataView(buffer);
  view.setUint32(0, totalSize, true);
  for (var i = 0; i < itemCount; i++) {
    view.setUint32(4 + i * 4, offsets[i], true);
    array.set(new Uint8Array(buffers[i]), offsets[i]);
  }
  return buffer;
}
exports.serializeTable = serializeTable;
function SerializeByte32(value) {
  var buffer = assertArrayBuffer(value);
  assertDataLength(buffer.byteLength, 32);
  return buffer;
}
exports.SerializeByte32 = SerializeByte32;
function SerializeBytes(value) {
  var item = assertArrayBuffer(value);
  var array = new Uint8Array(4 + item.byteLength);
  new DataView(array.buffer).setUint32(0, item.byteLength, true);
  array.set(new Uint8Array(item), 4);
  return array.buffer;
}
exports.SerializeBytes = SerializeBytes;
function SerializeUint64(value) {
  var buffer = assertArrayBuffer(value);
  assertDataLength(buffer.byteLength, 8);
  return buffer;
}
exports.SerializeUint64 = SerializeUint64;
function SerializeScript(value) {
  var buffers = [];
  buffers.push(SerializeByte32(value.code_hash));
  var hashTypeView = new DataView(new ArrayBuffer(1));
  hashTypeView.setUint8(0, value.hash_type);
  buffers.push(hashTypeView.buffer);
  buffers.push(SerializeBytes(value.args));
  return serializeTable(buffers);
}
exports.SerializeScript = SerializeScript;
function SerializeDepositionLockArgs(value) {
  var buffers = [];
  buffers.push(SerializeByte32(value.owner_lock_hash));
  buffers.push(SerializeScript(value.layer2_lock));
  buffers.push(SerializeUint64(value.cancel_timeout));
  return serializeTable(buffers);
}
exports.SerializeDepositionLockArgs = SerializeDepositionLockArgs;
function buildScriptFromCodeHash(codeHash) {
  return {
    code_hash: codeHash,
    hash_type: "type",
    args: "0x",
  };
}
var generateDeployConfig = function (depositLockHash, ethAccountLockHash) {
  return {
    deposition_lock: buildScriptFromCodeHash(depositLockHash),
    eth_account_lock: buildScriptFromCodeHash(ethAccountLockHash),
  };
};
exports.generateDeployConfig = generateDeployConfig;
