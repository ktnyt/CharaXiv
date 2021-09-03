package otp

import (
	"crypto/hmac"
	"crypto/sha1"
	"encoding/base32"
	"encoding/binary"
	"fmt"
	"net/url"
	"strconv"
	"strings"

	"github.com/ktnyt/charaxiv/backend/internal/utils"
)

const PERIOD = 30

type Secret []byte

func (p Secret) String() string {
	return base32.StdEncoding.WithPadding(base32.NoPadding).EncodeToString(p)
}

func NewSecret(n int) Secret {
	return utils.NewToken(n)
}

func SecretFromString(s string) (Secret, error) {
	return base32.StdEncoding.DecodeString(strings.ToUpper(s))
}

func (p Secret) Verify(passcode int32, count int64) bool {
	hash := hmac.New(sha1.New, p)
	if err := binary.Write(hash, binary.BigEndian, count); err != nil {
		return false
	}
	h := hash.Sum(nil)
	i := h[19] & 0x0f
	n := int32(binary.BigEndian.Uint32(h[i:i+4]) & 0x7fffffff)
	correct := n % 1000000
	return passcode == correct
}

func (p Secret) VerifyWithAmbiguity(passcode int32, count int64, thres int64) bool {
	for i := count - thres; i < count+thres; i++ {
		if p.Verify(passcode, i) {
			return true
		}
	}
	return false
}

func ProvisionTOTP(issuer, account string, secret Secret) url.URL {
	v := url.Values{}
	v.Add("secret", secret.String())
	v.Add("issuer", issuer)
	v.Add("algorithm", "SHA1")
	v.Add("digits", "6")
	v.Add("period", strconv.Itoa(PERIOD))
	return url.URL{
		Scheme:   "otpauth",
		Host:     "totp",
		Path:     url.PathEscape(fmt.Sprintf("%s:%s", issuer, account)),
		RawQuery: v.Encode(),
	}
}
