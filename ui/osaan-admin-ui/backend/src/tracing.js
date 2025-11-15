import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { ZipkinExporter } from '@opentelemetry/exporter-zipkin';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { Resource } from '@opentelemetry/resources';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import autoInstrumentations from '@opentelemetry/auto-instrumentations-node';
const { getNodeAutoInstrumentations } = autoInstrumentations;
import { B3Propagator } from '@opentelemetry/propagator-b3';
import { trace } from '@opentelemetry/api';

const serviceName = 'osaan-admin-backend';

const resource = Resource.default().merge(
  new Resource({
    'service.name': serviceName,
  }),
);

const zipkinEndpoint =
  process.env.TRACING_ENDPOINT || 'http://zipkin-server:9411/api/v2/spans';

const exporter = new ZipkinExporter({ url: zipkinEndpoint });

const provider = new NodeTracerProvider({
  resource,
  spanProcessors: [new BatchSpanProcessor(exporter)],
});

provider.register({
  propagator: new B3Propagator(), // to match Spring Brave (B3 headers)
});

registerInstrumentations({
  tracerProvider: provider,
  instrumentations: [getNodeAutoInstrumentations()],
});

export const tracer = trace.getTracer(serviceName);

console.log('Tracing initialized for', serviceName, '->', zipkinEndpoint);