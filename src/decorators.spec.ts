import { Serialise, SerialiseParam } from "./decorators";

describe("Serialise", () => {
  it("will serialise response", () => {
    class Response {
      message: string;
      createdAt: Date;
    }

    const ResponseSerialiser = (v: any) => {
      const res = new Response();
      res.message = v?.message;
      res.createdAt = new Date();
      return res;
    };

    class App {
      @Serialise(ResponseSerialiser)
      hello() {
        return { message: "hello!" };
      }
    }

    const app = new App();
    const result = app.hello();

    expect(result).toBeInstanceOf(Response);
    expect(result).toEqual(
      expect.objectContaining({
        message: "hello!",
        createdAt: expect.any(Date),
      })
    );
  });

  it("will not serialise response", () => {
    class App {
      @Serialise()
      hello() {
        return { message: "hello!" };
      }
    }

    const app = new App();
    const result = app.hello();

    expect(result).toEqual({ message: "hello!" });
  });
});

describe("SerialiseParam", () => {
  it("will serialise parameters", () => {
    type SerialisedParam = {
      createdAt: Date;
    };

    const ReqSerialiser = (v: any) => {
      // you can add validation when converting the parameters
      if (!isDate(v?.createdAt)) {
        throw new Error("invalid data");
      }
      return { createdAt: new Date(v.createdAt) };
    };

    const TextSerialiser = (v: any) => `${v}`;

    class App {
      @Serialise()
      hello(
        @SerialiseParam(ReqSerialiser) req: SerialisedParam,
        @SerialiseParam(TextSerialiser) text: string
      ) {
        return { createdAt: req.createdAt, text };
      }
    }

    const app = new App();

    const timestamp = Date.now();

    expect(app.hello({ createdAt: timestamp } as never, 123 as never)).toEqual({
      createdAt: new Date(timestamp),
      text: "123",
    });
  });
});

/** helper functions */
function isDate(v: unknown) {
  const _date = new Date(v as never);

  return !isNaN(_date.getTime());
}
/** END: helper functions */
