package com.github.miguelsombrero.osaan.skill_catalog_service.config;

import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.security.OAuthFlow;
import io.swagger.v3.oas.annotations.security.OAuthFlows;
import io.swagger.v3.oas.annotations.security.OAuthScope;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@SecurityScheme(
        name = "bearer",
        type = SecuritySchemeType.OAUTH2,
        bearerFormat = "JWT",
        scheme = "bearer",
        flows = @OAuthFlows(
                authorizationCode = @OAuthFlow(
                        authorizationUrl = "${api.security.oauth2.authorization-url}",
                        tokenUrl = "${api.security.oauth2.token-url}"
                )
        )
)
public class OpenApiConfig {

    private final String apiVersion;
    private final String apiTitle;
    private final String apiDescription;
    private final String apiLicenseName;
    private final String apiLicenseUrl;
    private final String apiContactName;

    public OpenApiConfig(
            @Value("${api.version}") String apiVersion,
            @Value("${api.title}") String apiTitle,
            @Value("${api.description}") String apiDescription,
            @Value("${api.license.name}") String apiLicenseName,
            @Value("${api.license.url}") String apiLicenseUrl,
            @Value("${api.contact.name}") String apiContactName
    ) {
        this.apiVersion = apiVersion;
        this.apiTitle = apiTitle;
        this.apiDescription = apiDescription;
        this.apiLicenseName = apiLicenseName;
        this.apiLicenseUrl = apiLicenseUrl;
        this.apiContactName = apiContactName;
    }

    @Bean
    public GroupedOpenApi publicApi() {
        return GroupedOpenApi.builder()
                .group("public")
                .pathsToMatch("/v1/skills/**")
                .build();
    }

    @Bean
    public GroupedOpenApi adminApi() {
        return GroupedOpenApi.builder()
                .group("admin")
                .pathsToMatch("/v1/admin/skills/**")
                .build();
    }

    @Bean
    public OpenAPI openApi() {
        return new OpenAPI().info(new Info().title(apiTitle).description(apiDescription).version(apiVersion)
                .contact(new Contact().name(apiContactName))
                .license(new License().name(apiLicenseName).url(apiLicenseUrl))
        );
    }
}
