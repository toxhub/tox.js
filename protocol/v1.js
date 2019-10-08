'use strict';

const ByteBuffer = require('byte');
const {
  PROTO,
  PACKET_TYPE,
  SERIALIZER_TYPE,
  VERSION,
  PACKET_PARAM: {
    IS_CRC,
    IS_HPACK,
  },
} = require('../common/constant');

const kMaxBuf = 8 * 1024 * 1024;

exports.encode = (serializer, opts) => {
  const buf = ByteBuffer.allocate(kMaxBuf);
  buf.put(PROTO);
  buf.put(PACKET_TYPE[opts.type].VALUE);
  buf.put(SERIALIZER_TYPE[opts.codec].VALUE);
  buf.put(VERSION[opts.version].VALUE);
  buf.put(opts.isCrc && IS_CRC.N || IS_CRC.Y);
  buf.put(opts.isCrc && IS_HPACK.N || IS_HPACK.Y);
  // encode header
  const headerBuf = serializer.encode(opts.headers);
  buf.putShort(headerBuf);
  const contentBuf = serializer.encode(opts.content);
  buf.putInt(contentBuf);
  return buf.array();
};


exports.decode = (serializer, opts) => {
};