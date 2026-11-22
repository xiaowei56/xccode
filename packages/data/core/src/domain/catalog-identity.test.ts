import { describe, expect, test } from "bun:test"
import { catalogIdentity } from "./catalog-identity"

describe("stats catalog identity", () => {
  test("resolves Xccode offerings to canonical labs", () => {
    const identity = catalogIdentity({
      models: { "meituan/longcat-2.5-preview": {} },
      providers: {
        xccode: { models: { "longcat-2.5-preview-free": { canonical_model_id: "meituan/longcat-2.5-preview" } } },
        "xccode-go": {
          models: { "longcat-2.5-preview-free": { canonical_model_id: "meituan/longcat-2.5-preview" } },
        },
      },
    })

    expect(identity.offerings.get("xccode/longcat-2.5-preview-free")).toBe("meituan")
    expect(identity.offerings.get("xccode-go/longcat-2.5-preview-free")).toBe("meituan")
    expect(identity.models.get("longcat-2.5-preview")).toBe("meituan")
  })

  test("does not guess a lab for a name shared by different canonical models", () => {
    const identity = catalogIdentity({
      models: { "lab-a/model": {}, "lab-b/model": {} },
      providers: {
        xccode: { models: { "model-free": { canonical_model_id: "lab-a/model" } } },
        "xccode-go": { models: { model: { canonical_model_id: "lab-b/model" } } },
      },
    })

    expect(identity.offerings.get("xccode/model-free")).toBe("lab-a")
    expect(identity.offerings.get("xccode-go/model")).toBe("lab-b")
    expect(identity.models.has("model")).toBe(false)
  })

  test("accepts provider IDs that are already canonical catalog IDs", () => {
    const identity = catalogIdentity({
      models: { "xccode/direct-model": {} },
      providers: { xccode: { models: { "direct-model": {} } } },
    })

    expect(identity.offerings.get("xccode/direct-model")).toBe("xccode")
    expect(identity.models.get("direct-model")).toBe("xccode")
  })

  test("rejects a catalog without published canonical identities", () => {
    expect(() => catalogIdentity({ models: {}, providers: { xccode: { models: { model: {} } } } })).toThrow(
      "Model catalog has no canonical Xccode offerings",
    )
  })
})
